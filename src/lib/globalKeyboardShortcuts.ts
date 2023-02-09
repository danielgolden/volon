import {
  deleteActiveNote,
  downloadBackupOfData,
  displayCommandPalette,
} from "../lib/utils";
import { useSettingsStore } from "../stores/store.settings";
import { useGenericStateStore } from "../stores/store.genericState";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { saveAppSettingsToLocalStorage } from "./localStorage";

export const globalKeyboardShortcuts = () => {
  const genericState = useGenericStateStore();
  const elementRefs = useElementRefsStore();
  const settings = useSettingsStore();

  window.addEventListener("keydown", (event) => {
    event.preventDefault();

    if (event.altKey && event.metaKey && event.code === "KeyN") {
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.code === "Backspace") {
      deleteActiveNote();
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyP") {
      settings.toggleMarkdownPreviewActive();
      saveAppSettingsToLocalStorage();
    } else if (event.metaKey && event.code === "KeyK") {
      if (settings.asideActive) {
        elementRefs.asideSearchInput?.focus();
      } else {
        displayCommandPalette();
      }
    } else if (event.metaKey && event.shiftKey && event.code === "KeyS") {
      downloadBackupOfData();
    } else if (event.metaKey && event.code == "Slash") {
      settings.asideActive = !settings.asideActive;
    }
    if (event.code === "Escape") {
      if (!genericState.commandPaletteActive) return;
      genericState.commandPaletteActive = false;
      setTimeout(() => {
        genericState.commandPaletteMatchingNotes = null;
        genericState.commandPaletteCurrentQuery = "";
      }, 150);
    }
  });
};
