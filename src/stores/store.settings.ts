import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      asideActive: false,
      markdownPreviewActive: false,
    };
  },
  actions: {
    toggleAsideActive() {
      this.asideActive = !this.asideActive;
    },
    setAsideActive(newValue: boolean) {
      this.asideActive = newValue;
    },
  },
});
