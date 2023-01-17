import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      asideActive: true,
      markdownPreviewActive: true,
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
});
