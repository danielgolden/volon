<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Aside from "./components/Aside.vue";
import Editor from "./components/Editor.vue";
import VueMarkdown from "vue-markdown-render";
import { store } from "./store";
import { getNote, getDefaultNotesData } from "./utils";

const existingNotesDataFound = () => !!localStorage.getItem("volon");

const initializeNotesData = () => {
  JSON.stringify(getDefaultNotesData());
  localStorage.setItem("volon", JSON.stringify(getDefaultNotesData()));
};

const currentNote = computed(() => {
  if (!store.activeNoteId) return null;
  const matchedNote = store.loadedData.notes.find(
    (note) => note.id === store.activeNoteId
  );
  return matchedNote;
});

onMounted(() => {
  if (!existingNotesDataFound()) {
    initializeNotesData();
  }

  store.loadedData = JSON.parse(localStorage.getItem("volon")!);
});
</script>

<template>
  <main :class="{ 'aside-active': store.asideActive }">
    <Aside v-if="store.asideActive" />
    <Editor />
    <vue-markdown class="markdown-preview" :source="store.activeNoteContents" />
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

.markdown-preview {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  padding: 8px 24px;
  line-height: 145%;
}
</style>
