import { store } from "./store";
import { v4 as uuidv4 } from "uuid";

export const getNoteById = (noteId: string | null) => {
  if (noteId === null) throw new Error("noteId parameter must not be null");

  const matchedNote = store.loadedData.notes.find((note) => note.id === noteId);
  if (!matchedNote) {
    throw new Error("No matching note found");
  }
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
  getNoteById(store.activeNoteId).content = currentContent;
  getNoteById(store.activeNoteId).lastModified = new Date();
  localStorage.setItem("volon", JSON.stringify(store.loadedData));
};

export const createNewNote = () => {
  const newNoteData = new Note();

  store.activeNoteId = newNoteData.id;
  store.loadedData.notes.push(newNoteData);
};

export const getNotesByContent = (content: string): Note[] => {
  const matchedNotes = store.loadedData.notes.filter((note) => {
    return note.content.includes(content);
  });

  return matchedNotes;
};

export const sortNotesByModificationDate = (notes: Note[]): Note[] => {
  const sortedNotes = notes.sort((currentNote, nextNote) => {
    return nextNote.lastModified.getTime() - currentNote.lastModified.getTime();
  });

  return sortedNotes;
};

export const getIndexOfNoteById = (id: string | null) => {
  if (!id) return null;

  return store.loadedData.notes.findIndex(
    (note) => note.id === store.activeNoteId
  );
};

export const deleteActiveNote = () => {
  const indexOfActiveNote = getIndexOfNoteById(store.activeNoteId);

  if (indexOfActiveNote === null) {
    throw new Error(`No note with the ID ${store.activeNoteId} found.`);
  }

  store.loadedData.notes.splice(indexOfActiveNote, 1);
};

export const clearActiveNoteState = () => {
  store.activeNoteId = null;
  store.activeNoteContents = "";
};

export const setWindowDimensions = () => {
  const doc = document.documentElement;

  doc.style.setProperty("--doc-height", `${window.innerHeight}px`);
  doc.style.setProperty("--doc-width", `${window.innerWidth}px`);
};
