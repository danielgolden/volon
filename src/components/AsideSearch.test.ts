import { mount, VueWrapper } from "@vue/test-utils";
import AsideSearch from "./AsideSearch.vue";
import { store } from "../store";
import { getDefaultNotesData, getNoteById, Note } from "../lib/utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  store.loadedData = getDefaultNotesData();
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
    store.loadedData = getDefaultNotesData();
    store.loadedData.notes[0].content = "I'm unique note content";

    const searchQuery = "unique";
    // @ts-ignore: Property 'handleInputChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const handleInputChange = wrapper?.vm.handleInputChange;

    handleInputChange(searchQuery);

    store.matchingNotes?.forEach((note) => {
      expect(note.content).toContain(searchQuery);
    });
  });

  it('Sets store.matchingNotes to null if the searchQuery is ""', () => {
    // @ts-ignore: Property 'handleInputChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const handleInputChange = wrapper?.vm.handleInputChange;
    handleInputChange("");

    expect(store.matchingNotes).toBe(null);
  });
});

describe("handleSearchKeydownEnter()", () => {
  it("Creates a new note with the currentQuery as the header", async () => {
    const searchQuery = "I'm a new note title/search query";
    store.matchingNotes = [];

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = searchQuery;
    await wrapper?.find("input").trigger("keydown.enter");

    const lastNoteIndex = store.loadedData.notes.length - 1;

    expect(store.loadedData.notes[lastNoteIndex].content).toContain(
      searchQuery
    );
  });

  it("Creates a new note, even if a match as been found for the query", async () => {
    const searchQuery = "I'm a new note title/search query";
    store.matchingNotes = wrapper?.props("noteList")[0];

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = searchQuery;
    await wrapper?.find("input").trigger("keydown.enter");

    const lastNoteIndex = store.loadedData.notes.length - 1;

    expect(store.loadedData.notes[lastNoteIndex].content).toContain(
      searchQuery
    );
  });

  it("Will clear the input if a note has been selected", async () => {
    store.loadedData.notes = wrapper?.props("noteList");
    store.matchingNotes = wrapper?.props("noteList")[0];

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
    store.loadedData.notes = wrapper?.props("noteList");
    store.matchingNotes = wrapper?.props("noteList");
    store.activeNoteId = wrapper?.props("noteList")[0].id;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.down");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(store.activeNoteId).toBe(store.matchingNotes[1].id);
  });

  it("Navigates to the first note if none is selected", async () => {
    store.loadedData.notes = wrapper?.props("noteList");
    store.matchingNotes = wrapper?.props("noteList");
    store.activeNoteId = null;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.down");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(store.activeNoteId).toBe(store.matchingNotes[0].id);
  });
});

describe("handleDownPreviousPress()", () => {
  it("Navigates to the previous note if available", async () => {
    store.loadedData.notes = wrapper?.props("noteList");
    store.matchingNotes = wrapper?.props("noteList");
    store.activeNoteId = wrapper?.props("noteList")[1].id;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "e";
    await wrapper?.find("input").trigger("keydown.up");

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    expect(store.activeNoteId).toBe(store.matchingNotes[0].id);
  });
});
