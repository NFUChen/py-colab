from command_executor import CommandExecutor
import time

venv_pip = "/venv/bin/pip3"
venv_py = "/venv/bin/python3"
cmd_executor= CommandExecutor()

def save_code_with_path(path: str, code: str) -> None:
    with open(f"/src/{path}", 'w') as file:
        file.write(code)


def list_modules() -> list[str]:
    cmd = f"{venv_pip} freeze"
    cmd_executor.execute(cmd)
    while (cmd_executor.is_executing):
        time.sleep(0.05)
        continue
    modules = map(lambda module: module.split("==") ,cmd_executor.get_log())
    return [
        {"name": module_list[0], "version": module_list[1]} 
        for module_list in modules
    ]
 


if __name__ == "__main__":
    print(list_modules())