import { defineStore } from "pinia";
import { EditorView } from "@codemirror/view";

export const useElementRefsStore = defineStore("elementRefs", {
  state: () => {
    return {
      codeMirror: <null | EditorView>null,
      asideSearchInput: <null | HTMLInputElement>null,
      commandPaletteSearchInput: <null | HTMLInputElement>null,
    };
  },
});
