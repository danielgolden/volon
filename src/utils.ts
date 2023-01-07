import { store } from "./store";
import { v4 as uuidv4 } from "uuid";

export const getNote = (noteId: string | null) => {
  if (noteId === null) throw new Error("noteId parameter must not be null");

  const matchedNote = store.loadedData.notes.find((note) => note.id === noteId);
  if (!matchedNote) throw new Error("No matching note found");
  return matchedNote;
};

export const getDefaultNotesData = (): LoadedNotesData => {
  return {
    queryHasMatch: false,
    notes: [
      new Note("I'm just a sample note"),
      new Note("I'm just another sample note"),
    ],
  };
};

export class Note {
  id: string | null;
  content: string;
  dateCreated: Date;
  lastModified: Date;

  constructor(content?: string) {
    const currentDate = new Date();

    this.id = uuidv4();
    this.content = content ?? "";
    this.dateCreated = currentDate;
    this.lastModified = currentDate;
  }
}

export const saveCurrentNoteChange = (currentContent: string) => {
  getNote(store.activeNoteId).content = currentContent;
  localStorage.setItem("volon", JSON.stringify(store.loadedData));
};

export const createNewNote = () => {
  const newNoteData = new Note();

  store.activeNoteId = newNoteData.id;
  store.loadedData.notes.push(newNoteData);
};
