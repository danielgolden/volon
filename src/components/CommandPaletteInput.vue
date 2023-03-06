<script lang="ts" setup>
import { ref, onMounted, PropType, watch } from "vue";
import { createNewNote } from "../lib/utils";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";
import { useUiStateStore } from "../stores/store.ui";

const props = defineProps({
  items: {
    required: true,
    type: Array as PropType<CommandPaletteItem[]>,
  },
});
const noteWasSelectedDuringSearch = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);
const elementRefs = useElementRefsStore();
const genericState = useGenericStateStore();
const notebook = useNotebookStore();
const uiState = useUiStateStore();

const handleInputChange = (currentContent: string) => {
  noteWasSelectedDuringSearch.value = false;

  if (currentContent === "") {
    genericState.commandPaletteMatchingNotes = null;
  } else {
    genericState.commandPaletteMatchingNotes =
      notebook.getNotesByContent(currentContent);
  }
};

const clearQuery = () => {
  setTimeout(() => {
    handleInputChange("");
    genericState.commandPaletteCurrentQuery = "";
  }, 100);
};

const getIndexOfSelecetedCommandItem = () => {
  let indexOfSelectedItem = 0;
  props.items.forEach((item, index) => {
    if (item.id === genericState.selectedCommandPaletteItem!.id) {
      indexOfSelectedItem = index;
    }
  });

  return indexOfSelectedItem;
};

const handleSearchKeydownEnter = (e: Event) => {
  uiState.commandPaletteActive = false;

  if (genericState.selectedCommandPaletteItem?.type === "command") {
    clearQuery();
    e.preventDefault();
    genericState.selectedCommandPaletteItem?.action();
  } else if (genericState.selectedCommandPaletteItem?.type === "note") {
    clearQuery();
    e.preventDefault();
    elementRefs.codeMirror?.focus();
    genericState.selectedCommandPaletteItem?.action();
  } else {
    createNewNote(`# ${genericState.commandPaletteCurrentQuery} \n`);
    clearQuery();
    genericState.searchJustCreatedNote = true;
  }
};

const handleDownArrowPress = (e: Event) => {
  e.preventDefault();
  noteWasSelectedDuringSearch.value = true;

  const indexOfSelectedItem = getIndexOfSelecetedCommandItem();

  if (indexOfSelectedItem < props.items.length - 1)
    genericState.selectedCommandPaletteItem =
      props.items[indexOfSelectedItem + 1];
};

const handleUpArrowPress = (e: Event) => {
  e.preventDefault();
  noteWasSelectedDuringSearch.value = true;

  const indexOfSelectedItem = getIndexOfSelecetedCommandItem();

  if (indexOfSelectedItem > 0)
    genericState.selectedCommandPaletteItem =
      props.items[indexOfSelectedItem - 1];
};

onMounted(() => {
  elementRefs.commandPaletteSearchInput = searchInput.value;
});

watch(
  () => props.items,
  () => {
    genericState.selectedCommandPaletteItem = props.items[0];
  }
);
</script>

<template>
  <input
    class="search-input"
    type="text"
    v-model="genericState.commandPaletteCurrentQuery"
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
  caret-color: #5fa9ff;
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
