import { reactive } from "vue";

export const store = reactive({
  noteContent: "# Hi ther, I'm a note",
  loadedData: {
    newNoteName: "string",
    queryHasMatch: false,
    notes: [
      {
        id: null,
        name: "",
        content: "",
        dateCreated: new Date(),
        lastModified: new Date(),
      },
    ],
  },
});
