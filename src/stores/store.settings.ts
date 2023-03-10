import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: (): settingsStore => {
    return {
      asideActive: true,
      markdownPreviewActive: false,
      theme: "system",
      noteOrderPreference: "dateModified",
      notePreviewContents: "dateModified",
      userColorSchemePreference: "light",
      fullWidthNotes: "never",
      syncScroll: false,
    };
  },
  actions: {
    toggleAsideActive() {
      this.asideActive = !this.asideActive;
    },
    toggleMarkdownPreviewActive() {
      this.markdownPreviewActive = !this.markdownPreviewActive;
    },
    setUserColorSchemePreference() {
      this.userColorSchemePreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
        ? "dark"
        : "light";
    },
  },
  getters: {
    themeResult: (state) => {
      if (state.theme === "dark" || state.theme === "light") {
        return state.theme;
      } else {
        return state.userColorSchemePreference;
      }
    },
    fullWidthNotesResult: (state) => {
      if (state.fullWidthNotes === "always") {
        return true;
      } else if (
        state.fullWidthNotes === "whenPreviewActive" &&
        state.markdownPreviewActive
      ) {
        return true;
      }
      return false;
    },
  },
});
