import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useUiStateStore = defineStore("ui", {
  state: () => {
    return {
      settingsViewActive: false,
      fullScreenPreviewActive: false,
      commandPaletteActive: false,
      toasts: <Toast[]>[],
    };
  },
  actions: {
    toggleCommandPaletteActive() {
      this.commandPaletteActive = !this.commandPaletteActive;
    },
    addToast(title: string, description: string, action: () => void) {
      this.toasts.push({
        title,
        description,
        action,
        id: uuidv4(),
      });
    },
  },
  getters: {
    hasActiveToast: (state) => state.toasts.length > 0,
  },
});
