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

  it("Ensures all note dates are Date objects", () => {
    localStorage.clear();

    store.loadedData.notes.forEach((note) => {
      expect(note.lastModified).toBeInstanceOf(Date);
      expect(note.dateCreated).toBeInstanceOf(Date);
    });
  });
});

describe("parseAllNoteDates()", () => {
  it("Outputs an array of notes with all dates as Date objects", () => {
    const sampleNoteWithStringDates = {
      id: "",
      content: "",
      dateCreated: "2023-01-07T15:00:37.494Z",
      lastModified: "2023-01-07T15:00:37.494Z",
    };
    const result = wrapper?.vm.parseAllNoteDates([sampleNoteWithStringDates]);

    console.log(result.dateCreated);

    expect(result[0].dateCreated).toBeInstanceOf(Date);
    expect(result[0].lastModified).toBeInstanceOf(Date);
  });
});
