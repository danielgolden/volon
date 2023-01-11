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
  // @ts-ignore
  editorWrapper = mount(Editor, {
    context: {
      props: { modelValue: store.activeNoteContents },
    },
  });
});

afterEach(() => {
  if (editorWrapper) editorWrapper.unmount;
  if (appWrapper) appWrapper.unmount;
});

describe("The editor's responses to change", () => {
  it("If a note is active, handleOnChange will modify the current note", async () => {
    store.activeNoteId = store.loadedData.notes[0].id;
    // @ts-ignore: Property 'handleOnChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const testContent = "some test content";

    // @ts-ignore: Property 'myCodemirrorView' does not exist on type 'ComponentPublicInstance ts(2339)
    await editorWrapper?.vm.myCodemirrorView.dispatch({
      changes: { from: 0, insert: testContent },
    });

    expect(store.loadedData.notes[0].content).toBe(testContent);
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
