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
});
