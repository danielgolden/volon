import { setActivePinia, createPinia, storeToRefs } from "pinia";
import { useNotebookStore } from "./store.notebook";
import { useGenericStateStore } from "./store.genericState";
import { describe, it, expect, beforeEach } from "vitest";
import { Note } from "../lib/utils";

describe("getNotesByContent", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("Returns any notes with matching content", () => {
    const notebook = useNotebookStore();
    const searchQuery = "special";

    notebook.notes[0].content = searchQuery;

    expect(notebook.getNotesByContent(searchQuery).length).toBeGreaterThan(0);

    notebook.getNotesByContent("whaat").forEach((note) => {
      expect(note).toBeInstanceOf(Note);
      expect(note.content).toContain(searchQuery);
    });
  });

  it("Ignores letter casing", () => {
    const notebook = useNotebookStore();
    const searchQuery = "SpEcIaL";
    notebook.notes[0].content = searchQuery;

    expect(notebook.getNotesByContent(searchQuery)).not.toStrictEqual([]);
  });
});

describe("getNoteById", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("Returns a note when a matching noteId is found", () => {
    const notebook = useNotebookStore();
    const genericState = useGenericStateStore();

    genericState.activeNoteId = notebook.notes[0].id;
    expect(notebook.getNoteById(genericState.activeNoteId)).toBeInstanceOf(
      Note
    );
  });

  it("Throws an error if the provided noteId is null", () => {
    const notebook = useNotebookStore();
    const genericState = useGenericStateStore();

    genericState.activeNoteId = notebook.notes[0].id;

    expect(() => notebook.getNoteById(null)).toThrow();
  });

  it("Throws an error if no matching note is found", () => {
    const notebook = useNotebookStore();
    const genericState = useGenericStateStore();

    genericState.activeNoteId = notebook.notes[0].id;

    expect(() => notebook.getNoteById("aFakeNoteId")).toThrow();
  });
});

describe("deleteActiveNote", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("deletes the note at the given indes", () => {
    const notebook = useNotebookStore();
    const genericState = useGenericStateStore();

    genericState.activeNoteId = notebook.notes[0].id;
    const idOfFirstNote = notebook.notes[0].id;

    notebook.deleteActiveNote();

    expect(() => notebook.getNoteById(idOfFirstNote)).toThrow();
  });
});
