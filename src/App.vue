<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import AsideNoteList from "./components/AsideNoteList.vue";
import SettingsView from "./components/SettingsView.vue";
import PrimaryNav from "./components/PrimaryNav.vue";
import Editor from "./components/Editor.vue";
import MarkdownPreview from "./components/MarkdownPreview.vue";
import CommandPalette from "./components/CommandPalette.vue";
import Toast from "./components/Toast.vue";
import Resizer from "./components/Resizer.vue";
import { useSettingsStore } from "./stores/store.settings";
import { useGenericStateStore } from "./stores/store.genericState";
import { useUiStateStore } from "./stores/store.ui";
import { useElementRefsStore } from "./stores/store.elementRefs";
import { setWindowDimensions, processUrlParams } from "./lib/utils";
import {
  intializeLocalStorageData,
  loadAppSettingsFromLocalStorage,
} from "./lib/localStorage";
import { loadExistingDBData, getSession } from "./lib/supabase";
import { globalKeyboardShortcuts } from "./lib/globalKeyboardShortcuts";

const notesDataLoaded = ref(false);
const settings = useSettingsStore();
const genericState = useGenericStateStore();
const uiState = useUiStateStore();
const elementRefs = useElementRefsStore();
const editorAndPreview = ref<HTMLElement | null>(null);

watch(
  () => genericState.activeNoteId,
  () => {
    uiState.settingsViewActive = false;
  }
);

watch(
  () => editorAndPreview.value,
  () => {
    elementRefs.editorAndPreview = editorAndPreview.value;
  }
);

// Set theme on body
watch(
  () => settings.themeResult,
  () => {
    document.body.dataset.theme = settings.themeResult;
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
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const mediaQueryHandler = () => {
    settings.setUserColorSchemePreference();
  };

  if (mediaQuery?.addEventListener) {
    mediaQuery.addEventListener("change", mediaQueryHandler);
  } else {
    mediaQuery.addListener(mediaQueryHandler);
  }

  document.body.dataset.theme = settings.themeResult;
});
</script>

<template>
  <main
    v-if="notesDataLoaded"
    :class="{
      'aside-active': settings.asideActive,
      'markdown-preview-active': settings.markdownPreviewActive,
      'column-is-being-resized': genericState.columnIsBeingResized,
    }"
  >
    <PrimaryNav />
    <AsideNoteList />

    <!-- <section class="primary-content" ref="editorAndPreview"> -->
    <Editor
      v-model="genericState.activeNoteContents"
      v-if="!uiState.settingsViewActive && !uiState.fullScreenPreviewActive"
    />
    <Resizer
      :left-element="elementRefs.codemirrorContainer"
      v-if="settings.markdownPreviewActive && !uiState.settingsViewActive"
      :reset-on-hide="true"
    />
    <MarkdownPreview
      v-if="settings.markdownPreviewActive && !uiState.settingsViewActive"
    />
    <SettingsView v-if="uiState.settingsViewActive" />
    <!-- </section> -->
    <CommandPalette />
    <Toast />
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

.column-is-being-resized {
  user-select: none;
  cursor: col-resize;
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
