import { EditorView } from "@codemirror/view";
import { reactive } from "vue";

export const store = reactive({
  loadedData: <LoadedNotesData>{
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
