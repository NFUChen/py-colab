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
      className="btn hover:-translate-y-1 duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
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
        prose-pre:bg-gray-700 
        prose-code:text-white 
        prose-strong:text-slate-100
        prose-a:text-blue-400`}
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
      <div className="min-h-[80vh] flex flex-col">
        {messages.map(({ role, content }, idx) => (
          <ChatConversion role={role} content={content} key={`${idx}-${content}`} />
        ))}
      </div>
      <div className="flex space-x-3 items-center p-5 bg-black">
        <textarea
          onChange={handleChange}
          className="w-full min-h-[10vh] textarea textarea-bordered text-area-ghost text-black"
          placeholder="What would you like to ask ?"
        ></textarea>
        <Button label="Submit" handleClick={handleSubmit} isDisabled={isAnswering || isEmptyPrompt} />
        <Button label="Clear" handleClick={handleClearSession} isDisabled={isAnswering} />
      </div>
    </div>
  );
};
