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

onMounted(() => {
  setWindowDimensions();
  if (!existingNotesDataFound()) {
    initializeNotesData();
  }

  const volonData = JSON.parse(localStorage.getItem("volon")!);
  const processedVolonData = {
    ...volonData,
    notes: parseAllNoteDates(volonData.notes),
  };
  store.loadedData = processedVolonData;

  window.addEventListener("keydown", (event) => {
    if (event.altKey && event.metaKey && event.code === "KeyN") {
      event.preventDefault();
      clearActiveNoteState();
    } else if (event.metaKey && event.code === "Backspace") {
      event.preventDefault();
      deleteActiveNote();
      clearActiveNoteState();
    }
  });
});
</script>

<template>
  <main :class="{ 'aside-active': store.asideActive }">
    <Aside v-if="store.asideActive" />
    <Editor />
    <MarkdownPreview />
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
}

@media (max-width: 1400px) {
  .aside-active {
    grid-template-columns: 300px 1fr 1fr;
  }
}
</style>
