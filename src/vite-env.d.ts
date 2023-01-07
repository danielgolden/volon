/// <reference types="vite/client" />

interface Note {
  id: string | null;
  content: string;
  dateCreated: Date;
  lastModified: Date;
}

interface LoadedNotesData {
  queryHasMatch: boolean;
  notes: Note[];
}
