import { EditorView } from "@codemirror/view";
import { reactive } from "vue";

export const store = reactive({
  activeNoteContents: "",
  asideActive: true,
  matchingNotes: <Note[] | null>null,
  activeNoteId: <string | null>"",
  searchJustCreatedNote: false,
  elementRefs: {
    codeMirror: <null | EditorView>null,
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
