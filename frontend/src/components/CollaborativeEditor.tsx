// import { CodeMirrorEditor } from "./CodeMirrorEditor";
// import { CustomEditor } from "./CustomEditor";
// import { LogPanel } from "./LogPanel";

import { ChatPanel } from "./ChatPanel";

export const CollaborativeEditor: React.FC = () => {
  return (
    <div className="flex w-screen flex-col">
      {/* <div> */}
      {/* <CustomEditor /> */}
      {/* <CodeMirrorEditor /> */}
      {/* </div> */}
      {/* <div> */}
      {/* <LogPanel /> */}
      {/* </div> */}
      <ChatPanel />
    </div>
  );
};
