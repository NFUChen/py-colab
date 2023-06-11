class MessageGenerator:
    def __init__(self) -> None:
        self.idx = 0

    def generate_message(self, msg: str) -> dict[str, str]:
        msg = {
            "id": self.idx,
            "message": msg,
        }
        self.idx += 1
        return msg