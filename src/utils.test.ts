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
  setWindowDimensions,
  navigateToNoteByRelativeIndex,
  createSampleData,
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

    expect(getNotesByContent(searchQuery).length).toBeGreaterThan(0);

    getNotesByContent("whaat").forEach((note) => {
      expect(note).toBeInstanceOf(Note);
      expect(note.content).toContain(searchQuery);
    });
  });

  it("Ignores letter casing", () => {
    const searchQuery = "SpEcIaL";

    expect(getNotesByContent(searchQuery)).not.toStrictEqual([]);
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

describe("setWindowDimensions()", () => {
  it("Saves the window dimensions to css variables", () => {
    setWindowDimensions();

    const docWidthCSSVar =
      document.documentElement.style.getPropertyValue("--doc-width");
    const docHeightCSSVar =
      document.documentElement.style.getPropertyValue("--doc-height");

    expect(docWidthCSSVar).toBe(`${window.innerWidth}px`);
    expect(docHeightCSSVar).toBe(`${window.innerHeight}px`);
  });
});

describe("navigateToNoteByRelativeIndex()", () => {
  beforeEach(() => {
    store.loadedData.notes = [
      new Note("I'm the first note"),
      new Note("I'm the second note"),
      new Note("And I'm the third and last note"),
    ];
  });
  it("Navigates to a new note in the incoming list relative to the incoming index", () => {
    store.activeNoteId = getNotesByContent("second")[0].id;

    navigateToNoteByRelativeIndex(store.loadedData.notes, 1);
    expect(store.activeNoteId).toBe(store.loadedData.notes[2].id);
    navigateToNoteByRelativeIndex(store.loadedData.notes, -2);
    expect(store.activeNoteId).toBe(store.loadedData.notes[0].id);
  });

  it("Doesn't allow navigation before first note nor past last note", () => {
    store.activeNoteId = getNotesByContent("first")[0].id;
    navigateToNoteByRelativeIndex(store.loadedData.notes, -1);
    expect(store.activeNoteId).toBe(store.loadedData.notes[0].id);

    store.activeNoteId = getNotesByContent("last")[0].id;
    navigateToNoteByRelativeIndex(store.loadedData.notes, 1);
    expect(store.activeNoteId).toBe(store.loadedData.notes[2].id);
  });

  it("Allows navigation from first to another note", () => {
    store.activeNoteId = getNotesByContent("first")[0].id;
    navigateToNoteByRelativeIndex(store.loadedData.notes, 1);
    expect(store.activeNoteId).toBe(store.loadedData.notes[1].id);
  });
});

describe("createSampleData()", () => {
  it("Creates 50 dummy notes", () => {
    createSampleData();
    expect(store.loadedData.notes.length).toBeGreaterThanOrEqual(50);
  });
});
