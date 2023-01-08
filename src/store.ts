import { reactive } from "vue";

export const store = reactive({
  activeNoteContents: "",
  asideActive: true,
  markdownPreviewActive: true,
  matchingNotes: <Note[] | null>null,
  activeNoteId: <string | null>"",
  loadedData: <LoadedNotesData>{
    newNoteName: "string",
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
