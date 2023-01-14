import { EditorView } from "@codemirror/view";
import { reactive } from "vue";

export const store = reactive({
  activeNoteContents: "",
  activeNoteId: <string | null>"",
  asideActive: true,
  commandPaletteActive: false,
  matchingNotes: <Note[] | null>null,
  searchJustCreatedNote: false,
  elementRefs: {
    codeMirror: <null | EditorView>null,
    asideSearchInput: <null | HTMLInputElement>null,
    commandPaletterSearchInput: <null | HTMLInputElement>null,
  },
  loadedData: <LoadedNotesData>{
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
