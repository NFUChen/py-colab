import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { useEditorStore } from "../stores/EditorStore";
import { controllerServerUrl } from "./ApiUrl";
import { useSocket } from "../hooks/useSocket";

export const CodeMirrorEditor = () => {
  const code = useEditorStore(state => state.code);
  const setCode = useEditorStore(state => state.setCode);
  const path = useEditorStore(state => state.path);
  const { data: updatedCode, emitEvent } = useSocket(controllerServerUrl, "on_code_change", {});
  const onChange = (value: string) => {
    const currentCodeAndPath = { code: value, path: path };
    emitEvent(currentCodeAndPath);
  };

  setCode(updatedCode.code);

  return (
    <>
      <CodeMirror onChange={onChange} theme="dark" value={code} height="50vh" extensions={[python()]} />
    </>
  );
};
