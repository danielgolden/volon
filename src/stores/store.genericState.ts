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
      selectedCommandPaletteNote: <Note | null>null,
    };
  },
  actions: {
    toggleCommandPaletteActive() {
      this.commandPaletteActive = !this.commandPaletteActive;
    },
    clearActiveNoteState() {
      this.activeNoteId = null;
      this.activeNoteContents = "";
    },
    activateSelectedNote() {
      this.activeNoteId = this.selectedCommandPaletteNote!.id;
      this.activeNoteContents = this.selectedCommandPaletteNote!.content;
    },
  },
  getters: {
    userIsLoggedIn: (state) => state.session !== null,
  },
});
