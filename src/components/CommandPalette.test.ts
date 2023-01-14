import { mount, VueWrapper } from "@vue/test-utils";
import CommandPalette from "./CommandPalette.vue";
import { store } from "../store";
import { getDefaultNotesData } from "../utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  store.loadedData = getDefaultNotesData();
  wrapper = mount(CommandPalette);
});

afterEach(() => {
  if (wrapper) wrapper.unmount;
});

describe("Aside.vue", async () => {
  it("When you click on a note item, that note's ID is set to be the activeNoteId", () => {
    const listItem = wrapper?.get(".note-list-item");
    const listItemId = listItem?.attributes("data-note-id");
    listItem?.trigger("click");

    expect(store.activeNoteId).toBe(listItemId);
  });
});
