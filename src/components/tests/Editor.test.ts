import { mount, VueWrapper } from "@vue/test-utils";
import App from "../../App.vue";
import Editor from "../Editor.vue";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { useNotebookStore } from "../../stores/store.notebook";
import { useSettingsStore } from "../../stores/store.settings";
import { useGenericStateStore } from "../../stores/store.genericState";

// TODO: Figure out how to test keyboard shortcuts with vue test utils or another library.
// The best lead I have so far: https://testing-library.com/docs/user-event/keyboard

let editorWrapper: VueWrapper | null = null;
let appWrapper: VueWrapper | null = null;
beforeEach(() => {
  const pinia = createPinia();
  const app = createApp(App);
  app.use(pinia);
  appWrapper = mount(App);

  const notebook = useNotebookStore();
  const settings = useSettingsStore();
  const genericState = useGenericStateStore();

  // @ts-ignore
  editorWrapper = mount(Editor, {
    context: {
      props: { modelValue: genericState.activeNoteContents },
    },
  });
});

afterEach(() => {
  if (editorWrapper) editorWrapper.unmount;
  if (appWrapper) appWrapper.unmount;
});

describe("The editor's responses to change", () => {
  it("If a note is active, it will modify the current note", async () => {
    const genericState = useGenericStateStore();
    const notebook = useNotebookStore();

    genericState.activeNoteId = notebook.notes[0].id;
    // @ts-ignore: Property 'handleOnChange' does not exist on type 'ComponentPublicInstance ts(2339)
    const testContent = "some test content";

    // @ts-ignore: Property 'myCodemirrorView' does not exist on type 'ComponentPublicInstance ts(2339)
    await editorWrapper?.vm.myCodemirrorView.dispatch({
      changes: { from: 0, insert: testContent },
    });

    const timer = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
        }, 500);
      });
    };

    await timer();

    expect(notebook.notes[0].content).toBe(testContent);
  });

  // it("Pastes a markdown link when there's a link in the clipboard and there's a selection", async () => {
  //   store.activeNoteId = store.loadedData.notes[0].id;

  //   // @ts-ignore: Property 'myCodemirrorView' does not exist on type 'ComponentPublicInstance ts(2339)
  //   const myCodemirrorView = editorWrapper?.vm.myCodemirrorView;
  //   const testContent = "some test content";

  //   // Add `testContent` to the beginning of the editor
  //   await myCodemirrorView.dispatch({
  //     changes: { from: 0, insert: testContent },
  //   });
  //   const codeMirrorContentsLength = myCodemirrorView.state.doc.length;

  //   // Select all content in the editor
  //   myCodemirrorView.focus();
  //   myCodemirrorView.dispatch({
  //     selection: { anchor: 0, head: codeMirrorContentsLength },
  //   });

  //   myCodemirrorView.dom.trigger("keydown", { keyCode: 65 });

  //   expect(store.loadedData.notes[0].content).toBe(testContent);
  // })

  // it("onChange the editor saves the changes to the current note", async () => {
  //   await editorWrapper?.get(".cm-content").trigger("keydown", { keyCode: 65 });

  //   const rawVolonData = localStorage.getItem("volon");
  //   if (!rawVolonData) return;

  //   const volonData = JSON.parse(rawVolonData);
  //   const firstNoteContent = volonData.notes[0].content;

  //   expect(firstNoteContent).toBe("A");
  // });
});
