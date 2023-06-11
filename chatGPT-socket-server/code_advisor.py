from typing import Literal, Generator
import dotenv
import os
import openai

Role =  Literal["system", "user", "assistant"]

class CodeAdvisor:
    PROMPT = f"""
    You are performing the role of a code advisor. 
    You will receive a programming question at a time, 
    Yor job is answer the question from the perspective of software development.
    """
    def __init__(self) -> None:
        self.messages = self._get_init_messages()
        self.__ask_api_key()

    def _get_init_messages(self) -> list[dict[str, str]]:
        return [
            {"role": "system", "content": self.PROMPT},
        ]

    def _add_message(self, role: Role, content: str) -> None:
        msg = {"role": role, "content": content}
        self.messages.append(msg)
    
    def __ask_api_key(self) -> None:
        dotenv.load_dotenv()
        key =  os.getenv("OPENAI_API_KEY")
        if key is None:
            raise ValueError("'OPENAI_API_KEY' not found")
            
        openai.api_key = key

    def clear_session(self) -> None:
        self.messages = self._get_init_messages()

    def _update_messages(self, msg: str) -> None:
        self.messages[-1]["content"] += msg

    @property
    def message_session(self) -> str:
        return self.messages[1:]

        
    def answer(self, question: str) -> Generator[str]:
        self._add_message("user", f"{question}\n")
        generator = openai.ChatCompletion.create(
            model= "gpt-3.5-turbo",
            stream= True,
            messages= self.messages
        )
        self._add_message("assistant", "")
        yield self.message_session
        for response in generator:
            choice = response['choices'][0]["delta"]
            if "content" in choice:
                content = choice["content"]
                self._update_messages(content)
                yield self.message_session
        self._update_messages("\n")

        yield self.message_session