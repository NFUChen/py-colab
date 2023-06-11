import { CodeMirrorEditor } from "./CodeMirrorEditor";
import { CustomEditor } from "./CustomEditor";
import { LogPanel } from "./LogPanel";

export const CollaborativeEditor: React.FC = () => {
  return (
    <div className="flex flex-col w-screen">
      <div>
        {/* <CustomEditor /> */}
        <CodeMirrorEditor />
      </div>
      <div>
        <LogPanel />
      </div>
    </div>
  );
};
