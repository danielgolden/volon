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
    if (event.altKey && event.metaKey && event.code === "KeyN") {
      event.preventDefault();
      elementRefs.codeMirror?.focus();
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.code === "Backspace") {
      event.preventDefault();
      deleteActiveNote();
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyP") {
      event.preventDefault();
      settings.toggleMarkdownPreviewActive();
      saveAppSettingsToLocalStorage();
    } else if (event.metaKey && event.code === "KeyK") {
      event.preventDefault();

      if (settings.asideActive) {
        elementRefs.asideSearchInput?.focus();
      } else {
        displayCommandPalette();
      }
    } else if (event.metaKey && event.shiftKey && event.code === "KeyS") {
      event.preventDefault();
      downloadBackupOfData();
    } else if (event.metaKey && event.code == "Slash") {
      event.preventDefault();
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
