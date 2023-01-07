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
  <div class="container">
    <input
      class="search-input"
      type="search"
      v-model="currentQuery"
      @input="(currentValue) => handleInputChange((currentValue.target as HTMLInputElement)?.value)"
    />
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  border-bottom: 1px solid var(--color-border-primary);
}

.search-input {
  width: 100%;
  height: 37px;
}
</style>
