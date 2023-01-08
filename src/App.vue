<script setup lang="ts">
import { onMounted } from "vue";
import Aside from "./components/Aside.vue";
import Editor from "./components/Editor.vue";
import VueMarkdown from "vue-markdown-render";
import { store } from "./store";
import {
  getDefaultNotesData,
  deleteActiveNote,
  clearActiveNoteState,
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
    <div class="markdown-preview-container">
      <vue-markdown
        class="markdown-preview"
        :source="store.activeNoteContents"
      />
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.aside-active {
  grid-template-columns: 350px 1fr 1fr;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.markdown-preview-container {
  display: flex;
  justify-content: center;
  padding: 34px 48px;
  background-color: var(--color-bg-surface-1);
  border-left: 1px solid var(--color-border-secondary);
  color: var(--color-text-primary);
}

.markdown-preview {
  max-width: 70ch;
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  line-height: 150%;
}
</style>
