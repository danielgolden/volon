<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import {
  getNotesByContent,
  createNewNote,
  navigateToNextNote,
  navigateToPreviousNote,
  saveAllNoteData,
} from "../utils";
import { store } from "../store";

const props = defineProps(["noteList"]);
const currentQuery = ref(``);
const noteWasSelectedDuringSearch = ref(false);
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

const handleSearchKeydownEnter = (e: Event) => {
  if (store.matchingNotes === null) return;
  const noMatchingNoteFound = store.matchingNotes?.length === 0;

  if (noteWasSelectedDuringSearch.value) {
    handleInputChange("");
    currentQuery.value = "";
    e.preventDefault();
    store.elementRefs.codeMirror?.focus();
  } else {
    createNewNote(`# ${currentQuery.value} \n`);
    handleInputChange("");
    currentQuery.value = "";
    saveAllNoteData();
    store.searchJustCreatedNote = true;
  }
};

const handleDownArrowPress = (e: Event) => {
  e.preventDefault();
  noteWasSelectedDuringSearch.value = true;

  if (!store.activeNoteId) {
    store.activeNoteId = props.noteList[0].id;
    store.activeNoteContents = props.noteList[0].content;
  } else {
    navigateToNextNote(props.noteList);
  }
};

const handleUpArrowPress = (e: Event) => {
  e.preventDefault();
  noteWasSelectedDuringSearch.value = true;
  navigateToPreviousNote(props.noteList);
};

onMounted(() => {
  store.elementRefs.asideSearchInput = searchInput.value;
});
</script>

<template>
  <div class="search-container">
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
      @keydown.enter="(e) => handleSearchKeydownEnter(e)"
      @keydown.down="(e) => handleDownArrowPress(e)"
      @keydown.up="(e) => handleUpArrowPress(e)"
      placeholder="Search or create..."
      ref="searchInput"
    />
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  margin: 18px 22px;
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

@media (prefers-color-scheme: light) {
  .keyboard-shortcut-indicator {
    box-shadow: inset 0 0 0 1px var(--color-border-input-enabled-indicator);
    background-color: transparent;
    transition: opacity 150ms var(--ease-in-out-cubic);
  }
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

@media (prefers-color-scheme: light) {
  .search-input {
    box-shadow: 0 3px 5px var(--color-box-shadow),
      0 1px 2px var(--color-box-shadow);
  }
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
