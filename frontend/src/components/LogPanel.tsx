import { useSocket } from "../hooks/useSocket";
// import { useEditorStore } from "../stores/EditorStore";
import { interpreterServerUrl, chatGptServerUtl } from "./ApiUrl";

interface IAnswer {
  role: string;
  content: string;
}

export const LogPanel: React.FC = () => {
  const { data: log } = useSocket<string[]>(interpreterServerUrl, "on_log", "");
  const { data: answer } = useSocket<IAnswer[]>(chatGptServerUtl, "on_log", "");
  return (
    <div className="flex flex-col w-screen">
      <div>
        <h1>Log</h1>
        <div className="min-h-20vh max-h-40vh">
          {log && log.map((msg, idx) => <p key={idx}>{msg}</p>)}
          {answer &&
            answer.map(({ role, content }) => {
              return (
                <pre key={content}>
                  {role}: {content}
                </pre>
              );
            })}
        </div>
      </div>
    </div>
  );
};
