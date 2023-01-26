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
}
