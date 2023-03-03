import { defineStore } from "pinia";
import { EditorView } from "@codemirror/view";

export const useElementRefsStore = defineStore("elementRefs", {
  state: () => {
    return {
      codeMirror: <null | EditorView>null,
      codemirrorContainer: <null | HTMLDivElement>null,
      asideSearchInput: <null | HTMLInputElement>null,
      commandPaletteSearchInput: <null | HTMLInputElement>null,
      asideNoteListContainer: <null | HTMLDivElement>null,
      editorAndPreview: <null | HTMLElement>null,
    };
  },
});
