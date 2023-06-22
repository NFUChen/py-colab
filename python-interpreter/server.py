from util import save_code_with_path, list_modules,CommandExecutor, cmd_executor, venv_pip, venv_py

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO
import os

PORT = os.environ['PORT']
app = Flask(__name__)
CORS(app)
sio = SocketIO(app, cors_allowed_origins="*")





def emit_log(log: str):
    sio.emit('on_log_resp', log)


def handle_sio_with_cmd_executor(sio: SocketIO, executor: CommandExecutor, command: str) -> None:
    executor.execute(command)
    while (cmd_executor.is_executing):
        log = cmd_executor.get_log()
        sio.start_background_task(emit_log, log)
        sio.sleep(0.05)

    final_log = cmd_executor.get_log()
    sio.start_background_task(emit_log, final_log)


@app.route("/")
def index():
    return "Welcome to python interpreter server"

@app.route("/cmd", methods=['POST'])
def cmd():
    data = request.get_json()
    cmd = data['cmd']
    handle_sio_with_cmd_executor(sio, cmd_executor, cmd)

    return {
        "message": "OK",
        "cmd": cmd,
    }
@app.route("/log", methods=['GET'])
def log():
    return {
        "message": "OK",
        "operation": "get log",
        "log": cmd_executor.get_log(),
    }
@app.route("/execute_python_code", methods=['POST'])
def execute_python_code():
    data = request.get_json()
    file_name = data['file_name']
    cmd = f"{venv_py} -u /src/{file_name}"

    handle_sio_with_cmd_executor(sio, cmd_executor, cmd)
    return {
        "message": "OK",
        "operation": "executing python code",
    }

@app.route("/save_code", methods=['POST'])
def save_code():
    data = request.get_json()
    path = data['path']
    code = data['code']
    save_code_with_path(path, code)
    return {
        "message": "OK",
        "path": path,
        "code": code,
    }

@app.route("/uninstall_package", methods=['POST'])
def uninstall_package():
    data = request.get_json()
    package_name = data['package_name']
    cmd = f"{venv_pip} uninstall -y {package_name}"

    handle_sio_with_cmd_executor(sio, cmd_executor, cmd)

    return {
        "message": "OK",
        "operation": "uninstall",
        "package_name": package_name,
    }

@app.route("/install_package", methods=['POST'])
def install_package():
    data = request.get_json()
    package_name = data['package_name']
    cmd = f"{venv_pip} install {package_name}"

    handle_sio_with_cmd_executor(sio, cmd_executor, cmd)
        
    return {
        "message": "OK",
        "operation": "install",
        "package_name": package_name,
    }

@app.route("/clear_venv", methods=['GET'])
def clear_venv():
    cmd = f"bash ./clear_venv.sh"
    handle_sio_with_cmd_executor(sio, cmd_executor, cmd)
    return {
        "message": "OK",
        "operation": "clear venv",
    }


@app.route("/kill_process", methods=['GET'])
def kill_process():
    cmd_executor.kill_current_process()
    return {
        "message": "OK",
        "operation": "kill",
    }

@app.route("/list_modules", methods=['GET'])
def list_modules_route():
    modules = list_modules()
    return {
        "message": "OK",
        "operation": "list modules",
        "modules": modules
    }


if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", debug= True, port= PORT)
