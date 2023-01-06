import { mount, VueWrapper } from "@vue/test-utils";
import App from "./App.vue";
import { store } from "../src/store";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  wrapper = mount(App);
});

afterEach(() => {
  if (wrapper) wrapper.unmount;
});

describe("App.vue", () => {
  it("If no saved data is found, it loads default data", () => {
    localStorage.clear();

    const firstNoteId = store.loadedData.notes[0].id;

    expect(firstNoteId).not.toBe(null);
  });
});
