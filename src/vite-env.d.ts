/// <reference types="vite/client" />

interface Note {
  id: string;
  name: string;
  content: string;
  dateCreated: Date;
  lastModified: Date;
}

interface LoadedNotesData {
  newNoteName: string;
  queryHasMatch: boolean;
  notes: Note[];
}
