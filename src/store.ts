import { EditorView } from "@codemirror/view";
import { reactive } from "vue";

export const store = reactive({
  activeNoteContents: "",
  activeNoteId: <string | null>"",
  commandPaletteActive: false,
  matchingNotes: <Note[] | null>null,
  searchJustCreatedNote: false,
  elementRefs: {
    codeMirror: <null | EditorView>null,
    asideSearchInput: <null | HTMLInputElement>null,
    commandPaletteSearchInput: <null | HTMLInputElement>null,
  },
  loadedData: <LoadedNotesData>{
    asideActive: true,
    markdownPreviewActive: true,
    queryHasMatch: false,
    notes: [
      {
        id: null,
        content: "",
        dateCreated: new Date(),
        lastModified: new Date(),
      },
    ],
  },
});
