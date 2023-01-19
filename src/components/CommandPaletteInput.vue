<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  createNewNote,
  navigateToNextNote,
  navigateToPreviousNote,
} from "../lib/utils";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";

const props = defineProps(["noteList"]);
const currentQuery = ref(``);
const noteWasSelectedDuringSearch = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const elementRefs = useElementRefsStore();
const genericState = useGenericStateStore();
const notebook = useNotebookStore();

const handleInputChange = (currentContent: string) => {
  if (currentContent === "") {
    genericState.matchingNotes = null;
  } else {
    genericState.matchingNotes = notebook.getNotesByContent(currentContent);
  }
};

const clearQuery = () => {
  handleInputChange("");
  currentQuery.value = "";
};

const handleSearchKeydownEnter = (e: Event) => {
  genericState.commandPaletteActive = false;
  if (noteWasSelectedDuringSearch.value) {
    clearQuery();
    e.preventDefault();
    elementRefs.codeMirror?.focus();
  } else {
    createNewNote(`# ${currentQuery.value} \n`);
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
  elementRefs.commandPaletteSearchInput = searchInput.value;
});
</script>

<template>
  <input
    class="search-input"
    type="text"
    v-model="currentQuery"
    @input="(currentValue) => handleInputChange((currentValue.target as HTMLInputElement)?.value)"
    @keydown.enter="(e) => handleSearchKeydownEnter(e)"
    @keydown.down="(e) => handleDownArrowPress(e)"
    @keydown.up="(e) => handleUpArrowPress(e)"
    placeholder="Search for or create a note&hellip;"
    ref="searchInput"
  />
</template>

<style scoped>
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
}
</style>
