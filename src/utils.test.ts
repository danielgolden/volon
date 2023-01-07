import { mount, VueWrapper } from "@vue/test-utils";
import App from "./App.vue";
import { store } from "../src/store";
import {
  saveCurrentNoteChange,
  createNewNote,
  Note,
  getDefaultNotesData,
  getNote,
} from "../src/utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("getNote()", () => {
  store.loadedData = getDefaultNotesData();
  store.activeNoteId = store.loadedData.notes[0].id;

  it("Returns a note when a matching noteId is found", () => {
    expect(getNote(store.activeNoteId)).toBeInstanceOf(Note);
  });

  it("Throws an error if the provided noteId is null", () => {
    expect(() => getNote(null)).toThrow();
  });

  it("Throws an error if no matching note is found", () => {
    expect(() => getNote("aFakeNoteId")).toThrow();
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
  it("Saves it's argument as the contents of the active note", () => {
    store.loadedData = getDefaultNotesData();
    store.activeNoteId = store.loadedData.notes[0].id;

    const testContent = "hi, I'm some test content";
    saveCurrentNoteChange(testContent);

    const firstNoteContent = store.loadedData.notes[0].content;

    expect(firstNoteContent).toBe(testContent);
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
