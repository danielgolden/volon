<script lang="ts" setup>
import { ref } from "vue";
import { getNotesByContent } from "../utils";
import { store } from "../store";

const currentQuery = ref(``);

const handleInputChange = (currentContent: string) => {
  if (currentContent === "") {
    store.matchingNotes = null;
  } else {
    store.matchingNotes = getNotesByContent(currentContent);
  }
};
</script>

<template>
  <input
    type="text"
    v-model="currentQuery"
    @input="(currentValue) => handleInputChange((currentValue.target as HTMLInputElement)?.value)"
  />
</template>

<style scoped></style>
