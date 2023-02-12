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

watch(
  () => genericState.activeNoteId,
  (newValue) => {
    genericState.settingsViewActive = false;
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
    loadAppSettingsFromLocalStorage();
    notesDataLoaded.value = true;
  }

  processUrlParams();
  globalKeyboardShortcuts();
  settings.setUserColorSchemePreference();

  window.addEventListener("resize", () => setWindowDimensions());

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      settings.setUserColorSchemePreference();
    });
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
      v-if="
        !genericState.settingsViewActive &&
        !genericState.fullScreenPreviewActive
      "
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
  background-color: var(--color-bg-surface-1);
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
