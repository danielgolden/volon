import App from "../../App.vue";
import {
  saveCurrentNoteChange,
  createNewNote,
  Note,
  sortNotesByModificationDate,
  getIndexOfNoteById,
  deleteActiveNote,
  setWindowDimensions,
  navigateToNoteByRelativeIndex,
  processUrlParams,
  setUrlParams,
} from "../utils";
import { createSampleDataInLocalStorage } from "../localStorage";
import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { createPinia, _StoreWithState } from "pinia";
import { useGenericStateStore } from "../../stores/store.genericState";
import { useNotebookStore } from "../../stores/store.notebook";
import { createApp } from "vue";
import { mount } from "@vue/test-utils";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);

const notebook = useNotebookStore();
const genericState = useGenericStateStore();

const wrapper = mount(App);

describe("getNoteById()", () => {
  beforeEach(() => {
    genericState.activeNoteId = notebook.notes[0].id;
  });

  it("Returns a note when a matching noteId is found", () => {
    expect(notebook.getNoteById(genericState.activeNoteId)).toMatchObject({
      id: expect.any(String),
      dateCreated: expect.any(Date),
      lastModified: expect.any(Date),
      content: expect.any(String),
    });
  });

  it("Throws an error if the provided noteId is null", () => {
    expect(() => notebook.getNoteById(null)).toThrow();
  });

  it("Throws an error if no matching note is found", () => {
    expect(() => notebook.getNoteById("aFakeNoteId")).toThrow();
  });
});

describe("saveCurrentNoteChange()", () => {
  let testContent = "";
  beforeEach(() => {
    // genericState.activeNoteId = notebook.notes[0].id;
    testContent = "hi, I'm some test content";
  });

  it("Saves it's argument as the contents of the active note", () => {
    const genericState = useGenericStateStore();
    genericState.activeNoteId = notebook.notes[0].id;

    saveCurrentNoteChange(testContent);
    const firstNoteContent = notebook.notes[0].content;

    expect(firstNoteContent).toBe(testContent);
  });

  it("Updates the lastModified date", () => {
    const lastModified = notebook.notes[0].lastModified;
    saveCurrentNoteChange(testContent);

    expect(lastModified).not.toBe(notebook.notes[0].lastModified);
  });
});

describe("createNewNote()", () => {
  it("Creates a new, blank note and adds it to the loadedData", () => {
    const notebook = useNotebookStore();

    createNewNote();

    const lastNote = notebook.notes.at(-1);

    expect(lastNote).toBeInstanceOf(Note);
    expect(lastNote?.content).toBe("");
  });
});

describe("getNotesByContent()", () => {
  beforeEach(() => {
    notebook.notes[0].content = "I'm just some special test data";
  });

  it("Returns any notes with matching content", () => {
    const searchQuery = "special";

    expect(notebook.getNotesByContent(searchQuery).length).toBeGreaterThan(0);

    notebook.getNotesByContent("whaat").forEach((note) => {
      expect(note).toBeInstanceOf(Note);
      expect(note.content).toContain(searchQuery);
    });
  });

  it("Ignores letter casing", () => {
    const searchQuery = "SpEcIaL";

    expect(notebook.getNotesByContent(searchQuery)).not.toStrictEqual([]);
  });
});

describe("sortNotesByModificationDate()", async () => {
  it("Returns an array with the most recently modified notes at the top", async () => {
    const firstNote: Note = new Note("first note");
    const secondNote: Note = new Note("second note");
    const thirdNote: Note = new Note("third note");
    const fourthNote: Note = new Note("fourth note");
    const fifthNote: Note = new Note("fifth note");

    const testNotes = [fifthNote, thirdNote, firstNote, secondNote, fourthNote];

    testNotes.forEach((note, index) =>
      note.lastModified.setDate(new Date().getDate() + index)
    );

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
    const notebook = useNotebookStore();

    notebook.notes[0].id = "hiyyaaaa";

    genericState.activeNoteId = notebook.notes[0].id;
    const idOfFirstNote = notebook.notes[0].id;

    expect(getIndexOfNoteById(idOfFirstNote)).toBe(0);
  });
});

describe("deleteActiveNote()", () => {
  it("Deletes the active note", () => {
    const notebook = useNotebookStore();
    const genericState = useGenericStateStore();

    genericState.activeNoteId = notebook.notes[0].id;
    const idOfFirstNote = notebook.notes[0].id;

    deleteActiveNote();

    expect(() => notebook.getNoteById(idOfFirstNote)).toThrow();
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
    notebook.notes = [
      new Note("I'm the first note"),
      new Note("I'm the second note"),
      new Note("And I'm the third and last note"),
    ];
  });
  it("Navigates to a new note in the incoming list relative to the incoming index", () => {
    genericState.activeNoteId = notebook.getNotesByContent("second")[0].id;

    navigateToNoteByRelativeIndex(notebook.notes, 1);
    expect(genericState.activeNoteId).toBe(notebook.notes[2].id);
    navigateToNoteByRelativeIndex(notebook.notes, -2);
    expect(genericState.activeNoteId).toBe(notebook.notes[0].id);
  });

  it("Doesn't allow navigation before first note nor past last note", () => {
    genericState.activeNoteId = notebook.getNotesByContent("first")[0].id;
    navigateToNoteByRelativeIndex(notebook.notes, -1);
    expect(genericState.activeNoteId).toBe(notebook.notes[0].id);

    genericState.activeNoteId = notebook.getNotesByContent("last")[0].id;
    navigateToNoteByRelativeIndex(notebook.notes, 1);
    expect(genericState.activeNoteId).toBe(notebook.notes[2].id);
  });

  it("Allows navigation from first to another note", () => {
    genericState.activeNoteId = notebook.getNotesByContent("first")[0].id;
    navigateToNoteByRelativeIndex(notebook.notes, 1);
    expect(genericState.activeNoteId).toBe(notebook.notes[1].id);
  });
});

describe("createSampleData()", () => {
  it("Creates 50 dummy notes", () => {
    const notebook = useNotebookStore();

    createSampleDataInLocalStorage();
    expect(notebook.notes.length).toBeGreaterThanOrEqual(50);
  });
});

describe("processUrlParams", () => {
  it("Loads the requested note if one has been specified", () => {
    const notebook = useNotebookStore();
    const genericState = useGenericStateStore();
    const specifiedNoteId = notebook.notes[0].id;
    const urlParams = `?noteId=${specifiedNoteId}`;

    processUrlParams(urlParams);

    expect(genericState.activeNoteContents).toBe(
      notebook.getNoteById(specifiedNoteId).content
    );
  });
  it("Loads runs the requested search if one has been specified", () => {
    const searchQuery = "freedom";
    const urlParams = `?search=${searchQuery}`;

    processUrlParams(urlParams);

    expect(genericState.noteListCurrentQuery).toBe(searchQuery);
  });
});

describe("setUrlParams", () => {
  it("Destructures an object into URL parameters", () => {
    const specifiedNoteId = notebook.notes[0].id;
    const desiredUrlParams = {
      search: "volon",
      noteId: specifiedNoteId,
      randomTestQuery: "yaboii",
    };

    setUrlParams(desiredUrlParams);

    const urlParams = window.location.search;
    expect(urlParams).toBe(
      `?search=volon&noteId=${specifiedNoteId}&randomTestQuery=yaboii`
    );
  });
});
