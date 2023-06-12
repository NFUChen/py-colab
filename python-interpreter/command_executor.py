import subprocess
import threading
import os


class CommandExecutor:
    def __init__(self) -> None:
        self.process = None
        self.should_kill = False
        self.is_executing = True
        self.MAX_QUEUE_SIZE = 500
        self.logs_queue = []

    def _enque_log(self, log: str) -> None:
        self.logs_queue.append(log)

    def _is_full_log_queue(self) -> bool:
        return len(self.logs_queue) == self.MAX_QUEUE_SIZE
    
    
    def _init_popen(self, command: str) -> None:
        try: 
            self.clear_log_queue()
            self.is_executing  = True
            self.process = subprocess.Popen(
                command.split(" "), 
                stdout=subprocess.PIPE, 
                stderr=subprocess.PIPE, 
                universal_newlines=True,
            )
            self._flush_output()
            self.is_executing = False
        except Exception as error:
            print(error)
            os._exit(1)
    
    def execute(self, command: str) -> None:
        if self.process is not None:
            self.process.kill()

        threading.Thread(target=lambda: self._init_popen(command)).start()
        
    def _flush_output(self) -> None:
        for line in self.process.stdout:
            self._handle_kill_process()
            self._handle_log_queue(line)
        for line in self.process.stderr:
            self._handle_kill_process()
            self._handle_log_queue(line)

    def get_log(self) -> list[str]:
        return self.logs_queue

    def kill_current_process(self) -> None:
        self.should_kill = True


    def _handle_log_queue(self, log: str) -> None:

        if self._is_full_log_queue():
            self.logs_queue.pop(0)
        self._enque_log(log.replace("\n", ""))

    def clear_log_queue(self) -> None:
        self.logs_queue = []
        
    def _handle_kill_process(self) -> None:

        if self.should_kill:
            self.process.terminate()
            self.should_kill = False
            self.clear_log_queue()
            return