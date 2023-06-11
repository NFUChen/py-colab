from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from redis_code_manager import code_manager
import requests
PORT = os.environ['PORT'] 

app = Flask(__name__)
CORS(app)
sio = SocketIO(app, cors_allowed_origins="*")





@sio.on('connect')
def handle_connect():
    print(f'Client {request.sid} connected')
    emit('connect_resp', {'data': 'connected sucessfully with server'})

@sio.on('disconnect')
def handle_disconnect():
    print(f'Client {request.sid} disconnected')
    emit('connect_resp', {'data': 'disconnected sucessfully with server'})

@sio.on("on_code_change")
def on_change(data):
    path = data['path']
    current_code = data['code']
    code_manager.set_code(path, current_code)
    emit('on_code_change_resp', data, broadcast=True, include_self=False)

    return "OK", 200

@app.route("/init", methods=['POST'])
def get_init_code():
    data = request.get_json()
    path = data['path']
    return code_manager.get_code(path), 200

@app.route("/log", methods=['POST'])
def log():
    data = request.get_json()
    sio.emit('on_log_resp', data)
    return "OK", 200

@app.route("/commit_code", methods=['GET'])
def commit_code():
    paths = code_manager.get_all_code_paths()
    for path in paths:
        code = code_manager.get_code(path)
        data = {"path": path, "code": code}
        response = requests.post("http://python-interpreter:8081/save_code", json=data).json()
        print(response)
    return "OK", 200

@app.route("/")
def index():
    return "Welcome to socket server for collaborative code editor"


if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", debug= False, port= PORT)
    
