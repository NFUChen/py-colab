import { useState } from "react";
import { useAskChatGPT } from "../hooks/useAskChatGPT";
import { BlinkingCursor } from "./BlinkCursor";
import ChatGPT from "../assets/ChatGPT.png";
import User from "../assets/User.png";

type Role = "user" | "assistant";

interface IChatConversion {
  role: Role;
  content: string;
}

const Button = ({
  label,
  handleClick,
  isDisabled
}: {
  label: string;
  handleClick: () => void;
  isDisabled: boolean;
}) => {
  return (
    <button
      className="btn duration-500 hover:-translate-y-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50"
      onClick={handleClick}
      disabled={isDisabled}
    >
      {label}
    </button>
  );
};

const handleImageSrc = (role: Role): string => {
  const lookup = {
    user: User,
    assistant: ChatGPT
  };
  return lookup[role];
};

const RawHTML = ({ html }: { html: string }) => {
  return (
    <div
      style={{ minWidth: "90%" }}
      className={`
        prose 
        text-white 
        prose-headings:text-white
        prose-a:text-blue-400 
        prose-strong:text-slate-100 
        prose-code:text-white
        prose-pre:bg-gray-700`}
      dangerouslySetInnerHTML={{
        __html: html
      }}
    />
  );
};

const ChatConversion: React.FC<IChatConversion> = ({ role, content }) => {
  const bgColor = role === "user" ? "bg-gray-700" : "bg-gray-900";
  console.log(content);
  return (
    <>
      <div className={`flex space-x-3 p-10 ${bgColor} w-100%`}>
        <div>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img className="bg-white" src={handleImageSrc(role)} />
            </div>
          </div>
        </div>
        <RawHTML html={content} />
      </div>
    </>
  );
};
export const ChatPanel = () => {
  const { messages, isAnswering, handleSubmitPrompt, handleClearSession } = useAskChatGPT();
  const [prompt, setPrompt] = useState("");
  const isEmptyPrompt = prompt === "";
  const handleChange = evt => {
    setPrompt(evt.target.value);
  };
  const handleSubmit = () => {
    if (!prompt) {
      return;
    }
    handleSubmitPrompt(prompt);
  };

  return (
    <div>
      <div className="flex min-h-[80vh] flex-col">
        {messages.map(({ role, content }, idx) => (
          <ChatConversion role={role} content={content} key={`${idx}-${content}`} />
        ))}
      </div>
      <div className="flex items-center space-x-3 bg-black p-5">
        <textarea
          onChange={handleChange}
          className="text-area-ghost textarea-bordered textarea min-h-[10vh] w-full text-black"
          placeholder="What would you like to ask ?"
        ></textarea>
        <Button label="Submit" handleClick={handleSubmit} isDisabled={isAnswering || isEmptyPrompt} />
        <Button label="Clear" handleClick={handleClearSession} isDisabled={isAnswering} />
      </div>
    </div>
  );
};
