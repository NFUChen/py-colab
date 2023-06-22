import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";

import { useEditorStore, AvailableLanguages } from "../stores/EditorStore";
import { controllerServerUrl } from "./ApiUrl";
import { useSocket } from "../hooks/useSocket";
import { useRef } from "react";

const getLanguageComment = (language: AvailableLanguages): string => {
  const prefix = {
    javascript: "//",
    python: "#"
  };

  return `${prefix[language]} write some ${language} code`;
};

export const CustomEditor: React.FC = () => {
  const setCode = useEditorStore(state => state.setCode);
  const language = useEditorStore(state => state.language);
  const code = useEditorStore(state => state.code);
  const path = useEditorStore(state => state.path);

  const { data: updatedCode, emitEvent } = useSocket(controllerServerUrl, "on_code_change", {});

  const editorRef = useRef<any>(null);

  const handleEditorDidMount = editor => {
    editorRef.current = editor;
    editor.updateOptions({
      cursorStyle: "line"
    });

    editor.focus();

    editor.onDidChangeCursorSelection(evt => {
      if (window) {
        console.log(window.getSelection().toString());
        const currentPosition = editor.getPosition();
        console.log(currentPosition);
      }
    });
  };

  const handleChange = (value: string | undefined, evt: monaco.editor.IModelContentChangedEvent): void => {
    if (!value) {
      return;
    }
    const editor = editorRef.current;
    const currentCodeAndPath = { code: value, path: path };
    emitEvent(currentCodeAndPath);
    if (editor) {
      const currentPosition = editor.getPosition();
      editor.setPosition(currentPosition);
      console.log(currentPosition);
    }
  };

  setCode(updatedCode.code);

  // TODO:
  // - a key is a file name and value being the code in backend redis server,
  // - when a user joins, they get the current value of the key (get_init)

  return (
    <Editor
      height={"50vh"}
      language={language}
      theme="vs-dark"
      value={code}
      defaultValue={getLanguageComment(language)}
      onChange={handleChange}
      onMount={handleEditorDidMount}
    />
  );
};
