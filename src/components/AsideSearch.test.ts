import { mount, VueWrapper } from "@vue/test-utils";
import AsideSearch from "./AsideSearch.vue";
import { Note } from "../lib/utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useGenericStateStore } from "../stores/store.genericState";
import { useSettingsStore } from "../stores/store.settings";
import { useNotebookStore } from "../stores/store.notebook";
import { createPinia } from "pinia";
import { createApp } from "vue";

const pinia = createPinia();
const app = createApp(AsideSearch);
app.use(pinia);

const settings = useSettingsStore();
const notebook = useNotebookStore();
const genericState = useGenericStateStore();

let wrapper: VueWrapper | null = null;

beforeEach(() => {
  wrapper = mount(AsideSearch, {
    props: {
      noteList: [
        new Note("I'm the first"),
        new Note("I'm the second"),
        new Note("I'm the third and last"),
      ],
    },
  });
});

afterEach(() => {
  if (wrapper) wrapper.unmount;
});

describe("handleInputChange()", async () => {
  it("Stores any notes with matching content in store.matchingNotes", () => {
    notebook.notes[0].content = "I'm unique note content";

    const searchQuery = "unique";
    // @ts-ignore: Property 'handleInputChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const handleInputChange = wrapper?.vm.handleInputChange;

    handleInputChange(searchQuery);
    genericState.matchingNotes?.forEach((note) => {
      expect(note.content).toContain(searchQuery);
    });
  });

  it('Sets store.matchingNotes to null if the searchQuery is ""', () => {
    const genericState = useGenericStateStore();

    // @ts-ignore: Property 'handleInputChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const handleInputChange = wrapper?.vm.handleInputChange;
    handleInputChange("");

    expect(genericState.matchingNotes).toBe(null);
  });
});

describe("handleSearchKeydownEnter()", () => {
  it("Creates a new note with the currentQuery as the header", async () => {
    const searchQuery = "I'm a new note title/search query";
    genericState.matchingNotes = [];

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = searchQuery;
    await wrapper?.find("input").trigger("keydown.enter");

    const lastNoteIndex = notebook.notes.length - 1;

    expect(notebook.notes[lastNoteIndex].content).toContain(searchQuery);
  });

  it("Creates a new note, even if a match as been found for the query", async () => {
    const searchQuery = "I'm a new note title/search query";
    genericState.matchingNotes = wrapper?.props("noteList")[0];

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = searchQuery;
    await wrapper?.find("input").trigger("keydown.enter");

    const lastNoteIndex = notebook.notes.length - 1;

    expect(notebook.notes[lastNoteIndex].content).toContain(searchQuery);
  });

  it("Will clear the input if a note has been selected", async () => {
    notebook.notes = wrapper?.props("noteList");
    genericState.matchingNotes = wrapper?.props("noteList")[0];

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.down");
    await wrapper?.find("input").trigger("keydown.enter");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(wrapper?.vm.currentQuery).toBe("");
  });
});

describe("handleDownArrowPress()", () => {
  it("Navigates to the next note if available", async () => {
    notebook.notes = wrapper?.props("noteList");
    genericState.matchingNotes = wrapper?.props("noteList");
    genericState.activeNoteId = wrapper?.props("noteList")[0].id;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.down");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(genericState.activeNoteId).toBe(genericState.matchingNotes[1].id);
  });

  it("Navigates to the first note if none is selected", async () => {
    notebook.notes = wrapper?.props("noteList");
    genericState.matchingNotes = wrapper?.props("noteList");
    genericState.activeNoteId = null;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.down");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(genericState.activeNoteId).toBe(genericState.matchingNotes[0].id);
  });
});

describe("handleDownPreviousPress()", () => {
  it("Navigates to the previous note if available", async () => {
    notebook.notes = wrapper?.props("noteList");
    genericState.matchingNotes = wrapper?.props("noteList");
    genericState.activeNoteId = wrapper?.props("noteList")[1].id;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.up");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(genericState.activeNoteId).toBe(genericState.matchingNotes[0].id);
  });
});
