import { reactive } from "vue";

export const store = reactive({
  activeNoteContents: "",
  asideActive: true,
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
