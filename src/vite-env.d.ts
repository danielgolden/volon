/// <reference types="vite/client" />

interface Note {
  id: string | null;
  content: string;
  dateCreated: Date;
  lastModified: Date;
}

interface LoadedNotesData {
  markdownPreviewActive: boolean;
  asideActive: boolean;
  notes: Note[];
}

interface settingsStore {
  asideActive: boolean;
  markdownPreviewActive: boolean;
  theme: "system" | "dark" | "light";
  noteOrderPreference: "dateModified" | "dateCreated";
  notePreviewContents: "dateModified" | "noteBody";
  userColorSchemePreference: "dark" | "light";
}

interface MenuItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  type?: "normal" | "destructive" | "separator";
}

interface Toast {
  title: string;
  description?: LanguageDescription;
  action?: () => void;
  id: uuid;
}
