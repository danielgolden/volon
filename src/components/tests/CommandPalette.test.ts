import { mount, VueWrapper } from "@vue/test-utils";
import CommandPalette from "../CommandPalette.vue";
import { randomIntFromInterval, Note } from "../../lib/utils";
import { createSampleDataInLocalStorage } from "../../lib/localStorage";
import { useGenericStateStore } from "../../stores/store.genericState";
import { useNotebookStore } from "../../stores/store.notebook";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createPinia } from "pinia";
import { createApp } from "vue";

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  const pinia = createPinia();
  const app = createApp(CommandPalette);
  app.use(pinia);
  wrapper = mount(CommandPalette);
});

afterEach(() => {
  if (wrapper) wrapper.unmount;
});

describe("handleNoteItemClick()", async () => {
  let randomNote = new Note();
  beforeEach(() => {
    const notebook = useNotebookStore();
    createSampleDataInLocalStorage();
    randomNote = notebook.notes[randomIntFromInterval(0, 50)];
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("It saves the incoming note ID to state", () => {
    const genericState = useGenericStateStore();

    //@ts-ignore
    wrapper?.vm.handleNoteItemClick(randomNote.id);
    expect(genericState.activeNoteId).toBe(randomNote.id);
  });

  it("It saves the incoming note contents to state", () => {
    const genericState = useGenericStateStore();
    //@ts-ignore
    wrapper?.vm.handleNoteItemClick(randomNote.id);
    expect(genericState.activeNoteContents).toBe(randomNote.content);
  });

  it("Toggles the the value of commandPaletteActive", () => {
    const genericState = useGenericStateStore();
    const originalCommandPaletteActive = genericState.commandPaletteActive;
    //@ts-ignore
    wrapper?.vm.handleNoteItemClick(randomNote.id);

    expect(genericState.commandPaletteActive).toBe(
      !originalCommandPaletteActive
    );
  });
});

describe("getActiveSelectionStatus()", () => {
  let randomNote = new Note();
  beforeEach(() => {
    const notebook = useNotebookStore();
    createSampleDataInLocalStorage();
    randomNote = notebook.notes[randomIntFromInterval(0, 50)];
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("Returns true if the active note has an ID found in matchingNotes", () => {
    const genericState = useGenericStateStore();
    genericState.activeNoteId = randomNote.id;
    // @ts-ignore
    expect(wrapper?.vm.getActiveSelectionStatus([randomNote])).toBe(true);
  });

  it("Returns true if a list item has an ID found in notesToBeDisplayed", () => {
    const genericState = useGenericStateStore();
    const notebook = useNotebookStore();
    genericState.activeNoteId = randomNote.id;
    notebook.notes = [randomNote];
    // @ts-ignore
    expect(wrapper?.vm.getActiveSelectionStatus()).toBe(true);
  });

  it("Returns false if a list item has an ID not found in notesToBeDisplayed nor matchingNotes", () => {
    const genericState = useGenericStateStore();

    // Store the random note in notesToBeDisplayed
    // expect the function to return to return false

    genericState.activeNoteId = "fakeNoteId";
    // @ts-ignore
    expect(wrapper?.vm.getActiveSelectionStatus()).toBe(false);
  });
});
