import axios from "axios";
import { useState } from "react";
import { chatGptServerUtl } from "../components/ApiUrl";
import { useSocket } from "./useSocket";
interface Message {
  role: "user" | "assistant";
  content: string;
}

export const useAskChatGPT = () => {
  const { data: messages } = useSocket<Message[]>(chatGptServerUtl, "on_chat_messages", []);
  const [serverMessage, setServerMessage] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const handleSubmit = (prompt: string) => {
    setIsAnswering(true);
    axios
      .post(`${chatGptServerUtl}/ask`, { question: prompt })
      .then(() => {
        setServerMessage("Your question has been submitted!");
        setIsAnswering(false);
      })
      .catch(error => {
        setServerMessage(error.response);
        setIsAnswering(false);
      });
  };

  const handleClearSession = () => {
    axios
      .get(`${chatGptServerUtl}/clear_session`)
      .then(() => {
        setServerMessage("Your session has been cleared!");
      })
      .catch(error => {
        setServerMessage(error.response);
      });
  };
  console.log(messages);

  return {
    messages: messages,
    serverMessage: serverMessage,
    isAnswering: isAnswering,
    handleSubmitPrompt: handleSubmit,
    handleClearSession: handleClearSession
  };
};
