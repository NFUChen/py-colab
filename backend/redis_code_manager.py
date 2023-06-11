import redis
import ast
class RedisCodeManager:
    def __init__(self) -> None:
        self.client = redis.Redis(host='redis-server', port=6379)
    
    def get_code(self, path: str) -> str:
        code = self.client.get(path)
        if code is None:
            return ""

        return code.decode()
    
    def set_code(self, path: str, code: str) -> None:
        self.client.set(path, code)

    
    def get_position(self, id: str) -> dict[str, int]:
        
        position = self.client.get(id)
        if position is None:
            return {"column": 0, "row": 0}
        return ast.literal_eval(position.decode())
    
    def set_position(self, id: str, column: int, row: int) -> None:
        self.client.set(id, {"column": column, "row": row})

    def get_all_code_paths(self) -> list[str]:
        return [path.decode() for path in self.client.keys("*")]

code_manager = RedisCodeManager()
