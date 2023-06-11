import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import * as MonacoCollabExt from "monaco-collab-ext";

const useEditorWithRemoteCursor = (
  initValue: string,
  language: string,
  theme = "vs-dark"
): { showCursor: () => void; hideCursor: () => void } => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const remoteCursorManagerRef = useRef<MonacoCollabExt.RemoteCursorManager | null>(null);
  const cursorRef = useRef<MonacoCollabExt.RemoteCursor | null>(null);

  useEffect(() => {
    // Create the editor
    editorRef.current = monaco.editor.create(document.getElementById("editor")!, {
      value: initValue,
      theme: theme,
      language: language
    });

    // Create the remote cursor manager
    remoteCursorManagerRef.current = new MonacoCollabExt.RemoteCursorManager({
      editor: editorRef.current,
      tooltips: true,
      tooltipDuration: 5
    });
  }, []);

  const showCursor = () => {
    cursorRef.current?.show();
  };

  const hideCursor = () => {
    cursorRef.current?.hide();
  };
};

export default useEditorWithRemoteCursor;
