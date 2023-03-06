import {
  deleteActiveNote,
  downloadBackupOfData,
  displayCommandPalette,
} from "../lib/utils";
import { useSettingsStore } from "../stores/store.settings";
import { useGenericStateStore } from "../stores/store.genericState";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { useUiStateStore } from "../stores/store.ui";
import { saveAppSettingsToLocalStorage } from "./localStorage";

export const globalKeyboardShortcuts = () => {
  const genericState = useGenericStateStore();
  const elementRefs = useElementRefsStore();
  const settings = useSettingsStore();
  const uiState = useUiStateStore();

  window.addEventListener("keydown", (event) => {
    if (event.altKey && event.metaKey && event.code === "KeyN") {
      event.preventDefault();
      genericState.clearActiveNoteState();
      setTimeout(() => {
        elementRefs.codeMirror?.focus();
      }, 25);
    } else if (event.metaKey && event.code === "Backspace") {
      event.preventDefault();
      deleteActiveNote();
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyP") {
      event.preventDefault();
      settings.toggleMarkdownPreviewActive();
      saveAppSettingsToLocalStorage();
    } else if (event.metaKey && event.code === "KeyK" && !event.shiftKey) {
      event.preventDefault();

      if (settings.asideActive) {
        elementRefs.asideSearchInput?.focus();
        elementRefs.asideSearchInput?.select();
      } else {
        displayCommandPalette();
      }
    } else if (event.metaKey && event.shiftKey && event.code === "KeyF") {
      event.preventDefault();
      displayCommandPalette();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyS") {
      event.preventDefault();
      downloadBackupOfData();
    } else if (event.metaKey && event.code == "Slash") {
      event.preventDefault();
      settings.asideActive = !settings.asideActive;
      saveAppSettingsToLocalStorage();
    }
    if (event.code === "Escape") {
      if (uiState.commandPaletteActive) {
        uiState.commandPaletteActive = false;
        setTimeout(() => {
          genericState.commandPaletteMatchingNotes = null;
          genericState.commandPaletteCurrentQuery = "";
        }, 150);
      } else if (uiState.settingsViewActive) {
        uiState.settingsViewActive = false;
      }
    }
  });
};
