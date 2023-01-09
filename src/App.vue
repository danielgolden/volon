<script setup lang="ts">
import { onMounted } from "vue";
import Aside from "./components/Aside.vue";
import Editor from "./components/Editor.vue";
import MarkdownPreview from "./components/MarkdownPreview.vue";
import { store } from "./store";
import {
  getDefaultNotesData,
  deleteActiveNote,
  clearActiveNoteState,
  setWindowDimensions,
  saveAllNoteData,
} from "./utils";

const existingNotesDataFound = () => !!localStorage.getItem("volon");

const initializeNotesData = () => {
  localStorage.setItem("volon", JSON.stringify(getDefaultNotesData()));
};

interface JSONParsedNote {
  id: string | null;
  content: string;
  dateCreated: string;
  lastModified: string;
}

const parseAllNoteDates = (notes: JSONParsedNote[]): Note[] => {
  return notes.map((note) => {
    return {
      ...note,
      lastModified: new Date(note.lastModified),
      dateCreated: new Date(note.dateCreated),
    };
  });
};

const loadExistingData = () => {
  if (!existingNotesDataFound()) {
    initializeNotesData();
  }

  const volonData = JSON.parse(localStorage.getItem("volon")!);
  const processedVolonData = {
    ...volonData,
    notes: parseAllNoteDates(volonData.notes),
  };
  store.loadedData = processedVolonData;
};

onMounted(() => {
  setWindowDimensions();
  loadExistingData();

  window.addEventListener("keydown", (event) => {
    if (event.altKey && event.metaKey && event.code === "KeyN") {
      event.preventDefault();
      clearActiveNoteState();
    } else if (event.metaKey && event.code === "Backspace") {
      event.preventDefault();
      deleteActiveNote();
      clearActiveNoteState();
    } else if (event.metaKey && event.shiftKey && event.code === "KeyP") {
      event.preventDefault();
      store.loadedData.markdownPreviewActive =
        !store.loadedData.markdownPreviewActive;
      saveAllNoteData();
    }
  });

  window.addEventListener("resize", () => setWindowDimensions());
});
</script>

<template>
  <main
    :class="{
      'aside-active': store.asideActive,
      'markdown-preview-active': store.loadedData.markdownPreviewActive,
    }"
  >
    <Aside v-if="store.asideActive" />
    <Editor />
    <MarkdownPreview v-if="store.loadedData.markdownPreviewActive" />
  </main>
</template>

<style scoped>
main {
  height: var(--doc-height);
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.aside-active {
  grid-template-columns: 350px 1fr 1fr;
  grid-template-areas: "aside editor editor";
}

.markdown-preview-active {
  grid-template-areas: "aside editor markdown-preview";
}

@media (max-width: 1400px) {
  .aside-active {
    grid-template-columns: 300px 1fr 1fr;
  }
}
</style>
