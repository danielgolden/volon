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
      placeholder="Search"
    />
  </div>
</template>

<style scoped>
.container {
  padding: 18px 22px;
  border-bottom: 1px solid var(--color-border-primary);
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 10px 12px;
  font-size: 16px;
  background-color: var(--color-bg-input-enabled);
  border-radius: 4px;
  box-shadow: 0 0 0 1px var(--color-bg-input-border-enabled);
  border: none;
  color: var(--color-text-secondary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-bg-input-border-enabled-focused);
}

.search-input::placeholder {
  color: var(--color-text-input-enabled-placeholder);
}

@media (max-width: 1400px) {
  .search-input {
    height: 37px;
    font-size: 14px;
  }
}
</style>
