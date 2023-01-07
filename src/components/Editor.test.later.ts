import { mount, VueWrapper } from "@vue/test-utils";
import App from "../App.vue";
import Editor from "./Editor.vue";
import { getDefaultNotesData, getNote } from "../utils";
import { store } from "../store";
import { describe, it, expect, beforeEach, afterEach } from "vitest";

let editorWrapper: VueWrapper | null = null;
let appWrapper: VueWrapper | null = null;
beforeEach(() => {
  store.loadedData = getDefaultNotesData();
  store.activeNoteId = store.loadedData.notes[0].id;
  appWrapper = mount(App);
  editorWrapper = mount(Editor);
});

afterEach(() => {
  if (editorWrapper) editorWrapper.unmount;
  if (appWrapper) appWrapper.unmount;
});

describe("Editor.vue", () => {
  it("onChange the editor saves the changes to the current note", async () => {
    await editorWrapper?.get(".cm-content").trigger("keydown", { keyCode: 65 });

    const rawVolonData = localStorage.getItem("volon");
    if (!rawVolonData) return;

    const volonData = JSON.parse(rawVolonData);
    const firstNoteContent = volonData.notes[0].content;

    expect(firstNoteContent).toBe("A");
  });
});
