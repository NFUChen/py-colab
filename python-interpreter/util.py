from command_executor import CommandExecutor

cmd_executor= CommandExecutor()

def save_code_with_path(path: str, code: str) -> None:
    with open(f"/src/{path}", 'w') as file:
        file.write(code)

