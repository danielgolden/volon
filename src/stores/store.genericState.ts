import { defineStore } from "pinia";

export const useGenericStateStore = defineStore("genericState", {
  state: () => {
    return {
      activeNoteContents: "",
      activeNoteId: <string | null>"",
      noteListMatchingNotes: <Note[] | null>null,
      commandPaletteMatchingNotes: <Note[] | null>null,
      searchJustCreatedNote: false,
      session: <any>null,
      selectedCommandPaletteItem: <CommandPaletteItem | null>null,
      noteListCurrentQuery: "",
      commandPaletteCurrentQuery: "",
      urlHasSearch: false,
      columnIsBeingResized: false,
      scrollSyncActiveSection: "both",
    };
  },
  actions: {
    clearActiveNoteState() {
      this.activeNoteId = null;
      this.activeNoteContents = "";
    },
  },
  getters: {
    userIsLoggedIn: (state) => state.session !== null,
    formattedSessionProvider: (state) => {
      if (state.session.user.app_metadata.provider === "github") {
        return "GitHub";
      } else if (state.session.user.app_metadata.provider === "google") {
        return "Google";
      }
    },
  },
});
