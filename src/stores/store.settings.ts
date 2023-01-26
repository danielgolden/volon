import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: (): settingsStore => {
    return {
      asideActive: true,
      markdownPreviewActive: false,
      theme: "system",
    };
  },
  actions: {
    toggleAsideActive() {
      this.asideActive = !this.asideActive;
    },
    toggleMarkdownPreviewActive() {
      this.markdownPreviewActive = !this.markdownPreviewActive;
    },
    systemThemePreference() {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    },
  },
  getters: {
    themeResult: (state) => {
      const systemPreferenceIsDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemPreferenceResult = systemPreferenceIsDark ? "dark" : "light";

      if (state.theme === "dark" || state.theme === "light") {
        return state.theme;
      } else {
        return systemPreferenceResult;
      }
    },
  },
});
