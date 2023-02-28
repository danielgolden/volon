<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import {
  createNewNote,
  navigateToNextNote,
  navigateToPreviousNote,
} from "../lib/utils";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";

const props = defineProps(["noteList"]);
const noteWasSelectedDuringSearch = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const keyboardShortcutIndicatorVisible = computed(() => {
  return genericState.noteListCurrentQuery.length < 32;
});
const elementRefs = useElementRefsStore();
const genericState = useGenericStateStore();
const notebook = useNotebookStore();

const handleInputChange = (currentContent: string) => {
  if (currentContent === "") {
    genericState.noteListMatchingNotes = null;
  } else {
    genericState.noteListMatchingNotes =
      notebook.getNotesByContent(currentContent);
  }
};

const clearQuery = () => {
  handleInputChange("");
  genericState.noteListCurrentQuery = "";
};

const handleSearchKeydownEnter = (e: Event) => {
  if (genericState.noteListMatchingNotes === null) return;

  if (noteWasSelectedDuringSearch.value) {
    clearQuery();
    e.preventDefault();
    elementRefs.codeMirror?.focus();
  } else {
    createNewNote(`# ${genericState.noteListCurrentQuery} \n`);
    clearQuery();
    genericState.searchJustCreatedNote = true;
  }
};

const handleDownArrowPress = (e: Event) => {
  e.preventDefault();
  noteWasSelectedDuringSearch.value = true;

  if (!genericState.activeNoteId) {
    genericState.activeNoteId = props.noteList[0].id;
    genericState.activeNoteContents = props.noteList[0].content;
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
  elementRefs.asideSearchInput = searchInput.value;

  if (genericState.urlHasSearch) {
    handleInputChange(genericState.noteListCurrentQuery);
    elementRefs.asideSearchInput?.focus();
  }
});
</script>

<template>
  <div class="search-container">
    <input
      :class="{
        'search-input': true,
        'has-value': genericState.noteListCurrentQuery.length > 0,
      }"
      type="search"
      v-model="genericState.noteListCurrentQuery"
      @input="(currentValue) => handleInputChange((currentValue.target as HTMLInputElement)?.value)"
      @keydown.enter="(e) => handleSearchKeydownEnter(e)"
      @keydown.down="(e) => handleDownArrowPress(e)"
      @keydown.up="(e) => handleUpArrowPress(e)"
      placeholder="Search or create..."
      ref="searchInput"
    />
    <span
      :class="{
        'keyboard-shortcut-indicator': true,
        'hidden-keyboard-indicator': !keyboardShortcutIndicatorVisible,
      }"
      >⌘K</span
    >
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  margin: 18px 22px 7px;
  min-width: 305px;
  z-index: 100;
}

.keyboard-shortcut-indicator {
  display: none;
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
  transition: opacity 150ms var(--ease-in-out-quad);
}

@media (prefers-color-scheme: light) {
  .keyboard-shortcut-indicator {
    box-shadow: inset 0 0 0 1px var(--color-border-primary);
    background-color: transparent;
    transition: opacity 150ms var(--ease-in-out-cubic);
  }
}
.hidden-keyboard-indicator {
  opacity: 0;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 41px;
  padding: 10px 12px;
  font-size: 16px;
  background-color: var(--color-bg-input-enabled);
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px var(--color-bg-input-border-enabled);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  transition: box-shadow 100ms var(--ease-out-cubic);
  /* caret-color: var(--color-accent); */
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-bg-input-border-enabled-focused);
}

.search-input::placeholder {
  color: var(--color-text-input-enabled-placeholder);
}

.search-input:placeholder-shown + .keyboard-shortcut-indicator,
.has-value:not(:hover) + .keyboard-shortcut-indicator {
  display: block;
}

.has-value:hover + .keyboard-shortcut-indicator,
.has-value:focus + .keyboard-shortcut-indicator {
  display: none;
}
/* 
@media (max-width: 1400px) {
  .search-input {
    height: 38px;
    font-size: 14px;
  }

  .keyboard-shortcut-indicator {
    top: 7.5px;
  }
} */
</style>
