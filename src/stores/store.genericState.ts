import { defineStore } from "pinia";
import { getNoteById } from "../lib/utils";

export const useGenericStateStore = defineStore("genericState", {
  state: () => {
    return {
      activeNoteContents: "",
      activeNoteId: <string | null>"",
      commandPaletteActive: false,
      matchingNotes: <Note[] | null>null,
      searchJustCreatedNote: false,
      session: <any>null,
    };
  },
  actions: {
    updateActiveNoteContentsByActiveId() {
      this.activeNoteContents = getNoteById(this.activeNoteId).content;
    },
  },
});
