<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AsideNoteList from "./components/AsideNoteList.vue";
import SettingsView from "./components/SettingsView.vue";
import PrimaryNav from "./components/PrimaryNav.vue";
import Editor from "./components/Editor.vue";
import MarkdownPreview from "./components/MarkdownPreview.vue";
import CommandPalette from "./components/CommandPalette.vue";
import { useSettingsStore } from "./stores/store.settings";
import { useGenericStateStore } from "./stores/store.genericState";
import {
  setWindowDimensions,
  processUrlParams,
  setUrlParams,
} from "./lib/utils";
import {
  intializeLocalStorageData,
  loadAppSettingsFromLocalStorage,
} from "./lib/localStorage";
import { loadExistingDBData, getSession } from "./lib/supabase";
import { globalKeyboardShortcuts } from "./lib/globalKeyboardShortcuts";

const notesDataLoaded = ref(false);
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

  globalKeyboardShortcuts();

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
    :data-theme="settings.themeResult"
  >
    <PrimaryNav />
    <AsideNoteList />
    <Editor
      v-model="genericState.activeNoteContents"
      v-if="!genericState.settingsViewActive"
    />
    <MarkdownPreview
      v-if="settings.markdownPreviewActive && !genericState.settingsViewActive"
    />
    <SettingsView v-if="genericState.settingsViewActive" />
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
