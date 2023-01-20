<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Aside from "./components/Aside.vue";
import AsideNoteList from "./components/AsideNoteList.vue";
import Editor from "./components/Editor.vue";
import MarkdownPreview from "./components/MarkdownPreview.vue";
import CommandPalette from "./components/CommandPalette.vue";
import { useSettingsStore } from "./stores/store.settings";
import { useGenericStateStore } from "./stores/store.genericState";
import {
  deleteActiveNote,
  setWindowDimensions,
  downloadBackupOfData,
  displayCommandPalette,
  processUrlParams,
  setUrlParams,
} from "./lib/utils";
import {
  saveAppSettingsToLocalStorage,
  intializeLocalStorageData,
  loadAppSettingsFromLocalStorage,
} from "./lib/localStorage";
import { loadExistingDBData, getSession } from "./lib/supabase";
import { useElementRefsStore } from "./stores/store.elementRefs";

const notesDataLoaded = ref(false);
const elementRefs = useElementRefsStore();
const settings = useSettingsStore();
const genericState = useGenericStateStore();

// Update the URL with the noteId when it changes
watch(
  () => genericState.activeNoteId,
  (newValue) => {
    setUrlParams({ noteId: newValue });
  }
);

onMounted(async () => {
  setWindowDimensions();
  await getSession();

  if (genericState.userIsLoggedIn) {
    await loadExistingDBData();
    loadAppSettingsFromLocalStorage();
    notesDataLoaded.value = true;
  } else {
    intializeLocalStorageData();
    notesDataLoaded.value = true;
  }

  processUrlParams();

  window.addEventListener("keydown", (event) => {
    if (event.altKey && event.metaKey && event.code === "KeyN") {
      event.preventDefault();
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.code === "Backspace") {
      event.preventDefault();
      deleteActiveNote();
      genericState.clearActiveNoteState();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyP") {
      event.preventDefault();
      settings.toggleMarkdownPreviewActive();
      saveAppSettingsToLocalStorage();
    } else if (event.metaKey && event.code === "Slash") {
      event.preventDefault();
      elementRefs.asideSearchInput?.focus();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyS") {
      event.preventDefault();
      downloadBackupOfData();
    } else if (event.metaKey && event.code === "KeyK") {
      // Aside is inactive, trigger command palette
      // and focus it's input
      event.preventDefault();
      displayCommandPalette();
    }
    if (event.code === "Escape") {
      if (!genericState.commandPaletteActive) return;
      genericState.commandPaletteActive = false;
    }
  });

  window.addEventListener("resize", () => setWindowDimensions());
});
</script>

<template>
  <main
    v-if="notesDataLoaded"
    :class="{
      'aside-active': settings.asideActive,
      'markdown-preview-active': settings.markdownPreviewActive,
    }"
  >
    <Aside />
    <AsideNoteList />
    <Editor v-model="genericState.activeNoteContents" />
    <MarkdownPreview v-if="settings.markdownPreviewActive" />
    <CommandPalette />
  </main>
</template>

<style scoped>
main {
  display: flex;
  height: var(--doc-height);
  width: 100%;
  position: relative;
  grid-template-columns: 1fr;
  grid-template-areas: "editor";
}

.aside-active {
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "aside editor";
}

.markdown-preview-active {
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "editor markdown-preview";
}

.aside-active.markdown-preview-active {
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "aside editor markdown-preview";
}

@media (max-width: 1400px) {
  .aside-active {
    grid-template-columns: 1fr 1fr;
  }
  .aside-active.markdown-preview-active {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
