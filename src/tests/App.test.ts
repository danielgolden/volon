import { mount, VueWrapper } from "@vue/test-utils";
import App from "../App.vue";
import { useNotebookStore } from "../stores/store.notebook";
import { createApp } from "vue";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  vi,
} from "vitest";
import { createPinia } from "pinia";

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

let wrapper: VueWrapper | null = null;
beforeEach(() => {
  const pinia = createPinia();
  const app = createApp(App);
  app.use(pinia);
  wrapper = mount(App);
});

afterEach(() => {
  if (wrapper) wrapper.unmount;
});

describe("App.vue", () => {
  it("If no saved data is found, it loads default data", () => {
    localStorage.clear();
    const notebook = useNotebookStore();
    const firstNoteId = notebook.notes[0].id;

    expect(firstNoteId).not.toBe(null);
  });

  it("Ensures all note dates are Date objects", () => {
    localStorage.clear();
    const notebook = useNotebookStore();

    notebook.notes.forEach((note) => {
      expect(note.lastModified).toBeInstanceOf(Date);
      expect(note.dateCreated).toBeInstanceOf(Date);
    });
  });

  // it("⌘ + alt + n clears the activeNoteId and activeNoteContents", async () => {
  //   store.activeNoteId = "I'm a fake note ID";
  //   store.activeNoteContents = "I'm some note contents";
  //   await wrapper?.trigger("keydown", {
  //     altKey: true,
  //     metaKey: true,
  //     code: "KeyN",
  //   });

  //   expect(store.activeNoteId).toBe(null);
  //   expect(store.activeNoteContents).toBe("");
  // });
});
