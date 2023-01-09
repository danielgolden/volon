import { mount, VueWrapper } from "@vue/test-utils";
import App from "../App.vue";
import Editor from "./Editor.vue";
import { getDefaultNotesData } from "../utils";
import { store } from "../store";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let editorWrapper: VueWrapper | null = null;
let appWrapper: VueWrapper | null = null;
beforeEach(() => {
  store.loadedData = getDefaultNotesData();
  appWrapper = mount(App);
  editorWrapper = mount(Editor);
});

afterEach(() => {
  if (editorWrapper) editorWrapper.unmount;
  if (appWrapper) appWrapper.unmount;
});

describe("handleOnChange()", () => {
  it("If a note is active, handleOnChange will modify the current note", () => {
    store.activeNoteId = store.loadedData.notes[0].id;
    // @ts-ignore: Property 'handleOnChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const handleOnChange = editorWrapper?.vm.handleOnChange;
    const testContent = "some test content";

    handleOnChange(testContent);

    expect(store.loadedData.notes[0].content).toBe(testContent);
  });

  it("If no note is active, handleOnChange creates a new note with the new content", () => {
    store.activeNoteId = null;
    // @ts-ignore: Property 'handleOnChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const handleOnChange = editorWrapper?.vm.handleOnChange;
    const testContent = "some test content";

    handleOnChange(testContent);

    const notes = store.loadedData.notes;
    const lastNote = notes.at(-1);

    expect(lastNote?.content).toBe(testContent);
  });

  // it("onChange the editor saves the changes to the current note", async () => {
  //   await editorWrapper?.get(".cm-content").trigger("keydown", { keyCode: 65 });

  //   const rawVolonData = localStorage.getItem("volon");
  //   if (!rawVolonData) return;

  //   const volonData = JSON.parse(rawVolonData);
  //   const firstNoteContent = volonData.notes[0].content;

  //   expect(firstNoteContent).toBe("A");
  // });
});
