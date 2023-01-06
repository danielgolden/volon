<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import Editor from "./components/Editor.vue";
import VueMarkdown from "vue-markdown-render";
import { store } from "./store";

const existingNotesDataFound = () => !!localStorage.getItem("volon");
const currentDate = new Date();
const defaultNotesData: LoadedNotesData = {
  newNoteName: ``,
  queryHasMatch: false,
  notes: [
    {
      id: uuidv4(),
      name: "Welcome to Volón",
      content: "I'm just a sample note",
      dateCreated: currentDate,
      lastModified: currentDate,
    },
    {
      id: uuidv4(),
      name: "How to do other stuff",
      content: "I'm just a another sample note",
      dateCreated: currentDate,
      lastModified: currentDate,
    },
  ],
};
const initializeNotesData = () => {
  localStorage.setItem("volon", JSON.stringify(defaultNotesData));
};

onMounted(() => {
  if (!existingNotesDataFound()) {
    initializeNotesData();
  }

  store.loadedData = JSON.parse(localStorage.getItem("volon")!);
});

defineExpose({
  store,
});
</script>

<template>
  <main>
    <Editor />
    <vue-markdown class="markdown-preview" :source="store.noteContent" />
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
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
