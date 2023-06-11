import subprocess
import threading
import time
class CommandExecutor:
    def __init__(self) -> None:
        self.process = None
        self.should_kill: bool = False
        self.logs_queue = []
        self.popen_startup_time = 0.1

    def _enque_log(self, log: str) -> None:
        self.logs_queue.append(log)

    def _is_full_log_queue(self) -> bool:
        return len(self.logs_queue) == 500
    
    def _init_popen(self, command: str) -> None:
        self.process = subprocess.Popen(
            command.split(" "), 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            universal_newlines=True
        )
    
    def execute(self, command: str) -> list[str]:
        if self.process is not None:
            self.process.kill()
        
        threading.Thread(target=lambda: self._init_popen(command)).start()
        time.sleep(self.popen_startup_time)
        

    def flush_output(self) -> list[str]:
        for line in self.process.stdout:
            self._handle_kill_process()
            yield self._handle_log_queue(line)
        for line in self.process.stderr:
            self._handle_kill_process()
            yield self._handle_log_queue(line)

        self._clear_log_queue()


    def kill_current_process(self) -> None:
        self.should_kill = True


    def _handle_log_queue(self, log: str) -> list[str]:

        if self._is_full_log_queue():
            self.logs_queue.pop(0)
        self._enque_log(log.replace("\n", ""))
        

        return self.logs_queue

    def _clear_log_queue(self) -> None:
        self.logs_queue = []
        
    def _handle_kill_process(self) -> None:

        if self.should_kill:
            self.process.terminate()
            self.should_kill = False
            self.logs_queue = []
            return



def save_code_with_path(path: str, code: str) -> None:
    with open(f"./src/{path}", 'w') as file:
        file.write(code)


# def default_venv() -> str:
#     cmd_executor = CommandExecutor()
#     base_modules = set()
#     with open("./depedencies.orig") as file:
#         for module_with_version in file: # module==version
#             base_modules.add(module_with_version)
#     installed_packages = subprocess.check_output(['pip3', 'freeze']).decode().split('\n')
#     for package in installed_packages:
#         if package in base_modules:
#             continue
#         for log in cmd_executor.execute(f"pip3 uninstall -y {package}"):
#             yield log

            
if __name__ == "__main__":
    # Testing the code
    command = "ping -c 5 google.com"  # Example command to test
    executor = CommandExecutor()
    idx = 0
    for output in executor.execute(command):
        idx += 1
        print(idx)
        print(output)
        if idx == 3:
            executor.kill_current_process()

