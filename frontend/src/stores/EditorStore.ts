import { create } from "zustand";

export type AvailableLanguages = "python" | "javascript";

export interface ILog {
  id: string;
  message: string[];
}

interface IEditorStore {
  language: AvailableLanguages;
  code: string;
  path: string;
  logs: ILog[];
  setLanguage: (language: AvailableLanguages) => void;
  setCode: (code: string) => void;
  setPath: (path: string) => void;
  clearLogs: () => void;
}

export const useEditorStore = create<IEditorStore>()(set => ({
  language: "python",
  code: "",
  path: "main.py",
  logs: [],
  setLanguage: lang => set(() => ({ language: lang })),
  setCode: code => set(() => ({ code: code })),
  setPath: path => set(() => ({ path: path })),
  clearLogs: () => set(() => ({ logs: [] }))
}));
