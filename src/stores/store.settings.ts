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
  },
  getters: {
    themeResult: (state) => {
      const systemPreferenceIsDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemThemePreference = systemPreferenceIsDark ? "dark" : "light";

      if (state.theme === "dark" || state.theme === "light") {
        return state.theme;
      } else {
        return systemThemePreference;
      }
    },
  },
});
