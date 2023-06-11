from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
from code_advisor import CodeAdvisor
import os
PORT = os.environ['PORT']


advisor = CodeAdvisor()

app = Flask(__name__)
CORS(app)
sio = SocketIO(app, cors_allowed_origins="*")

def emit_log(log: str):
    sio.emit('on_log_resp', log)

@app.route("/ask", methods=['POST'])
def ask():
    data = request.get_json()
    question = data['question']
    
    for msg in advisor.answer(question):
        sio.start_background_task(emit_log, msg)

    return {
        "message": "OK",
        "operation": "asking question",
        "question": question,
    }
@app.route("/clear_session", methods=["GET"])
def clear_session():
    advisor.clear_session()
    sio.start_background_task(emit_log, [])

    return {
        "message": "OK",
        "operation": "clearing session",
    }


@app.route("/")
def index():
    return "Welcome to chatGPT socket server"







if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", debug= True, port= PORT)
