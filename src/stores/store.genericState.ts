import { defineStore } from "pinia";

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
    toggleCommandPaletteActive() {
      this.commandPaletteActive = !this.commandPaletteActive;
    },
  },
  getters: {
    userIsLoggedIn: (state) => state.session !== null,
  },
});
