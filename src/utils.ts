import { store } from "./store";
import { v4 as uuidv4 } from "uuid";

export const getNote = (noteId: string | null) => {
  if (noteId === null) throw new Error("noteId parameter must not be null");

  const matchedNote = store.loadedData.notes.find((note) => note.id === noteId);
  if (!matchedNote) throw new Error("No matching note found");
  return matchedNote;
};

export const getDefaultNotesData = (): LoadedNotesData => {
  const currentDate = new Date();
  return {
    newNoteName: ``,
    queryHasMatch: false,
    notes: [
      {
        id: uuidv4(),
        name: "Welcome to Volón",
        content: "I'm just a sample note",
        dateCreated: currentDate,
        lastModified: currentDate,
      },
      {
        id: uuidv4(),
        name: "How to do other stuff",
        content: "I'm just a another sample note",
        dateCreated: currentDate,
        lastModified: currentDate,
      },
    ],
  };
};

export const newNote = (content?: string): Note => {
  return {
    id: uuidv4(),
    name: "",
    content: content ?? "",
    dateCreated: new Date(),
    lastModified: new Date(),
  };
};
