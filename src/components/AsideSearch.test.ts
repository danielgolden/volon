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
