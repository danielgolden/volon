import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

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
    addToast(toast: Toast) {
      const newToastId = uuidv4();
      let displayTimer = ref(setTimeout(() => {}, 0));
      let displayDelay = ref(8000);

      // Add toast to toasts array
      this.toasts.push({
        ...toast,
        id: newToastId,
      });

      // Remove toast after delay
      displayTimer.value = setTimeout(() => {
        const thisToast = this.toasts.find(
          (toast, index) => toast.id === newToastId
        );
        const thisToastIndex = this.toasts.indexOf(thisToast!);

        this.toasts.splice(thisToastIndex, 1);
      }, displayDelay.value);
    },
    toastIsActive(id: string) {
      return !!this.getToastById(id);
    },
    getToastById(id: string) {
      return this.toasts.find((toast) => toast.id === id);
    },
    getToastIndexById(id: string) {
      return this.toasts.indexOf(this.getToastById(id)!);
    },
  },
  getters: {
    hasActiveToast: (state) => state.toasts.length > 0,
  },
});
