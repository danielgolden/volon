import { mount, VueWrapper } from "@vue/test-utils";
import AsideSearch from "./AsideSearch.vue";
import { store } from "../store";
import { getDefaultNotesData } from "../utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  store.loadedData = getDefaultNotesData();
  wrapper = mount(AsideSearch);
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

  it("Won't create a new note if the search returned a match", async () => {
    const searchQuery = "I'm a new note title/search query";
    store.matchingNotes = null;

    // @ts-ignore: Property 'currentQuery' does not exist on type 'ComponentPublicInstance ts(2339)
    wrapper.vm.currentQuery = "I'm a new note title/search query";
    const noteCount = store.loadedData.notes.length;
    await wrapper?.find("input").trigger("keydown.enter");
    const lastNoteIndex = store.loadedData.notes.length - 1;

    expect(store.loadedData.notes[lastNoteIndex].content).not.toContain(
      searchQuery
    );
  });
});
