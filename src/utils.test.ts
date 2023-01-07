import { mount, VueWrapper } from "@vue/test-utils";
import App from "./App.vue";
import { store } from "../src/store";
import {
  saveCurrentNoteChange,
  createNewNote,
  Note,
  getDefaultNotesData,
  getNoteById,
  getNotesByContent,
  sortNotesByModificationDate,
  getIndexOfNoteById,
  deleteActiveNote,
  clearActiveNoteState,
} from "../src/utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("getNoteById()", () => {
  beforeEach(() => {
    store.loadedData = getDefaultNotesData();
    store.activeNoteId = store.loadedData.notes[0].id;
  });

  it("Returns a note when a matching noteId is found", () => {
    expect(getNoteById(store.activeNoteId)).toBeInstanceOf(Note);
  });

  it("Throws an error if the provided noteId is null", () => {
    expect(() => getNoteById(null)).toThrow();
  });

  it("Throws an error if no matching note is found", () => {
    expect(() => getNoteById("aFakeNoteId")).toThrow();
  });
});

describe("getDefaultNotesData()", () => {
  it("Returns the expected data structure", () => {
    const result = getDefaultNotesData();

    expect(result).toHaveProperty("queryHasMatch");
    expect(result).toHaveProperty("notes");
    expect(Array.isArray(result.notes)).toBe(true);

    result.notes.forEach((note) => {
      expect(note).toBeInstanceOf(Note);
    });
  });
});

describe("saveCurrentNoteChange()", () => {
  let testContent = "";
  beforeEach(() => {
    store.loadedData = getDefaultNotesData();
    store.activeNoteId = store.loadedData.notes[0].id;

    testContent = "hi, I'm some test content";
  });

  it("Saves it's argument as the contents of the active note", () => {
    saveCurrentNoteChange(testContent);
    const firstNoteContent = store.loadedData.notes[0].content;

    expect(firstNoteContent).toBe(testContent);
  });

  it("Updates the lastModified date", () => {
    const lastModified = store.loadedData.notes[0].lastModified;
    saveCurrentNoteChange(testContent);

    expect(lastModified).not.toBe(store.loadedData.notes[0].lastModified);
  });
});

describe("createNewNote()", () => {
  it("Creates a new, blank note and adds it to the loadedData", () => {
    createNewNote();

    const lastNote = store.loadedData.notes.at(-1);

    expect(lastNote).toBeInstanceOf(Note);
    expect(lastNote?.content).toBe("");
  });
});

describe("getNotesByContent()", () => {
  beforeEach(() => {
    store.loadedData = getDefaultNotesData();
    store.loadedData.notes[0].content = "I'm just some special test data";
  });

  it("Returns any notes with matching content", () => {
    const searchQuery = "special";

    getNotesByContent(searchQuery).forEach((note) => {
      expect(note).toBeInstanceOf(Note);
      expect(note.content).toContain(searchQuery);
    });
  });
});

describe("sortNotesByModificationDate()", async () => {
  it("Returns an array with the most recently modified notes at the top", async () => {
    let firstNote!: Note;
    let secondNote!: Note;
    let thirdNote!: Note;
    let fourthNote!: Note;
    let fifthNote!: Note;

    const setupNotes = () => {
      return new Promise((resolve) => {
        setTimeout(() => (firstNote = new Note("first note")), 10);
        setTimeout(() => (secondNote = new Note("second note")), 20);
        setTimeout(() => (thirdNote = new Note("third note")), 30);
        setTimeout(() => (fourthNote = new Note("fourth note")), 40);
        setTimeout(() => {
          fifthNote = new Note("fifth note");
          resolve("");
        }, 50);
      });
    };

    await setupNotes();

    const testNotes = [fifthNote, thirdNote, firstNote, secondNote, fourthNote];
    const sortedNotes = sortNotesByModificationDate(testNotes);

    sortedNotes.forEach((note, index) => {
      if (index === 0) return true;

      const lastModifiedTime = note.lastModified.getTime();
      const prevNoteLastModifiedTime =
        sortedNotes[index - 1].lastModified.getTime();

      expect(lastModifiedTime).toBeLessThan(prevNoteLastModifiedTime);
    });
  });
});

describe("getIndexOfNoteById()", () => {
  it("Returns the ID of the matching note", () => {
    store.loadedData = getDefaultNotesData();
    store.activeNoteId = store.loadedData.notes[0].id;
    const idOfFirstNote = store.loadedData.notes[0].id;

    expect(getIndexOfNoteById(idOfFirstNote)).toBe(0);
  });
});

describe("deleteActiveNote()", () => {
  it("Deletes the active note", () => {
    store.loadedData = getDefaultNotesData();
    store.activeNoteId = store.loadedData.notes[0].id;
    const idOfFirstNote = store.loadedData.notes[0].id;

    deleteActiveNote();

    expect(() => getNoteById(idOfFirstNote)).toThrow();
  });
});

describe("clearActiveNoteState()", () => {
  it("sets the active note state back to it's default", () => {
    store.loadedData = getDefaultNotesData();
    store.activeNoteId = store.loadedData.notes[0].id;

    clearActiveNoteState();

    expect(store.activeNoteContents).toBe("");
    expect(store.activeNoteId).toBe(null);
  });
});
