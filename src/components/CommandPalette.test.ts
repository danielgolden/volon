import { mount, VueWrapper } from "@vue/test-utils";
import CommandPalette from "./CommandPalette.vue";
import { store } from "../store";
import { getDefaultNotesData, randomIntFromInterval, Note } from "../lib/utils";
import { createSampleDataInLocalStorage } from "../lib/localStorage";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createPinia } from "pinia";
import { createApp } from "vue";

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  const pinia = createPinia();
  const app = createApp(CommandPalette);
  app.use(pinia);
  store.loadedData = getDefaultNotesData();
  wrapper = mount(CommandPalette);
});

afterEach(() => {
  if (wrapper) wrapper.unmount;
});

describe("handleNoteItemClick()", async () => {
  let randomNote = new Note();
  beforeEach(() => {
    createSampleDataInLocalStorage();
    randomNote = store.loadedData.notes[randomIntFromInterval(0, 50)];
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("It saves the incoming note ID to state", () => {
    //@ts-ignore
    wrapper?.vm.handleNoteItemClick(randomNote.id);
    expect(store.activeNoteId).toBe(randomNote.id);
  });

  it("It saves the incoming note contents to state", () => {
    //@ts-ignore
    wrapper?.vm.handleNoteItemClick(randomNote.id);
    expect(store.activeNoteContents).toBe(randomNote.content);
  });

  it("Toggles the the value of commandPaletteActive", () => {
    const originalCommandPaletteActive = store.commandPaletteActive;
    //@ts-ignore
    wrapper?.vm.handleNoteItemClick(randomNote.id);

    expect(store.commandPaletteActive).toBe(!originalCommandPaletteActive);
  });
});

describe("getActiveSelectionStatus()", () => {
  let randomNote = new Note();
  beforeEach(() => {
    createSampleDataInLocalStorage();
    randomNote = store.loadedData.notes[randomIntFromInterval(0, 50)];
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("Returns true if the active note has an ID found in matchingNotes", () => {
    store.activeNoteId = randomNote.id;
    // @ts-ignore
    expect(wrapper?.vm.getActiveSelectionStatus([randomNote])).toBe(true);
  });

  it("Returns true if a list item has an ID found in notesToBeDisplayed", () => {
    store.activeNoteId = randomNote.id;
    store.loadedData.notes = [randomNote];
    // @ts-ignore
    expect(wrapper?.vm.getActiveSelectionStatus()).toBe(true);
  });

  it("Returns false if a list item has an ID not found in notesToBeDisplayed nor matchingNotes", () => {
    // Store the random note in notesToBeDisplayed
    // expect the function to return to return false

    store.activeNoteId = "fakeNoteId";
    // @ts-ignore
    expect(wrapper?.vm.getActiveSelectionStatus()).toBe(false);
  });
});
