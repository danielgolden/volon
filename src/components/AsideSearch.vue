<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { getNotesByContent, createNewNote, saveAllNoteData } from "../utils";
import { store } from "../store";

const currentQuery = ref(``);
const searchInput = ref<HTMLInputElement | null>(null);
const keyboardShortcutIndicatorVisible = computed(() => {
  return currentQuery.value.length < 32;
});

const handleInputChange = (currentContent: string) => {
  if (currentContent === "") {
    store.matchingNotes = null;
  } else {
    store.matchingNotes = getNotesByContent(currentContent);
  }
};

// TODO: Write a test for this!
const handleSearchKeydownEnter = () => {
  if (store.matchingNotes === null) return;
  const noMatchingNoteFound = store.matchingNotes?.length === 0;
  const codeMirror = store.elementRefs.codeMirror;

  if (noMatchingNoteFound) {
    createNewNote(`# ${currentQuery.value} \n`);
    handleInputChange("");
    currentQuery.value = "";
    saveAllNoteData();
    store.searchJustCreatedNote = true;
  }
};

onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (searchInput === null) return;
    if (event.metaKey && event.code === "KeyK") {
      event.preventDefault();
      searchInput.value?.focus();
    }
  });
});
</script>

<template>
  <div class="container">
    <span
      :class="{
        'keyboard-shortcut-indicator': true,
        'hidden-keyboard-indicator': !keyboardShortcutIndicatorVisible,
      }"
      >⌘K</span
    >
    <input
      class="search-input"
      type="text"
      v-model="currentQuery"
      @input="(currentValue) => handleInputChange((currentValue.target as HTMLInputElement)?.value)"
      @keydown.enter="handleSearchKeydownEnter"
      placeholder="Search or create..."
      ref="searchInput"
    />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  margin: 18px 22px;
  border-bottom: 1px solid var(--color-border-primary);
}

.keyboard-shortcut-indicator {
  position: absolute;
  top: 9px;
  right: 8px;
  font-size: 12px;
  padding: 3px 5px;
  border-radius: 3px;
  letter-spacing: 1.5px;
  color: var(--color-text-input-enabled-indicator);
  /* border: 1px solid var(--color-border-tertiary); */
  background-color: var(--color-bg-input-enabled-indicator);
  transition: opacity 150ms var(--ease-in-out-cubic);
}

.hidden-keyboard-indicator {
  opacity: 0;
}

.search-input {
  width: 100%;
  height: 41px;
  padding: 10px 12px;
  font-size: 16px;
  background-color: var(--color-bg-input-enabled);
  border-radius: 4px;
  box-shadow: 0 0 0 1px var(--color-bg-input-border-enabled);
  border: none;
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
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
    height: 38px;
    font-size: 14px;
  }

  .keyboard-shortcut-indicator {
    top: 7.5px;
  }
}
</style>
