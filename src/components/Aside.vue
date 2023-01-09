<script lang="ts" setup>
import { computed } from "vue";
import {
  getNoteById,
  sortNotesByModificationDate,
  navigateToPreviousNote,
  navigateToNextNote,
} from "../utils";
import { store } from "../store";
import AsideSearch from "./AsideSearch.vue";
import { formatRelative, formatDistance, subDays } from "date-fns";

const searchIsActive = computed(() => {
  return store.matchingNotes !== null;
});

const notesToBeDisplayed = computed(() => {
  if (!searchIsActive.value) {
    return sortNotesByModificationDate(store.loadedData.notes);
  } else {
    return sortNotesByModificationDate(store.matchingNotes!);
  }
});
const handleNoteItemClick = (noteId: string | null) => {
  if (noteId) {
    store.activeNoteId = noteId;
    store.activeNoteContents = getNoteById(store.activeNoteId).content;
  }
};
</script>

<template>
  <aside>
    <AsideSearch />
    <ul
      class="note-list"
      tabindex="0"
      @keydown.up="navigateToPreviousNote(notesToBeDisplayed)"
      @keydown.down="navigateToNextNote(notesToBeDisplayed)"
    >
      <li
        v-for="note in notesToBeDisplayed"
        :v-key="note.id"
        :class="{
          'active-note-list-item': store.activeNoteId === note.id,
          'note-list-item': true,
        }"
        :data-note-id="note.id"
        @click="handleNoteItemClick(note.id)"
      >
        <span class="note-list-item-preview">
          {{ note.content.split(`\n`)[0].replaceAll("#", "").substring(0, 50) }}
          <em v-if="note.content.length === 0" class="empty-list-item-preview"
            >Empty note</em
          >
        </span>
        <span class="note-list-item-meta">{{
          formatRelative(note.lastModified, new Date())
        }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
aside {
  display: grid;
  grid-area: aside;
  height: 100%;
  overflow: hidden;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-2);
}
.note-list {
  border-top: 1px solid var(--color-border-primary);
  overflow-y: auto;
  margin: 0;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.note-list-item {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 4px;
}

.note-list-item:hover {
  background-color: var(--color-bg-interactive-hover);
  cursor: pointer;
}

.note-list-item-preview {
  font-size: 16px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}

.note-list-item-meta {
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.active-note-list-item {
  background-color: var(--color-bg-interactive-active);
}

.active-note-list-item:hover {
  background-color: var(--color-bg-interactive-active-hover);
}

.active-note-list-item .note-list-item-meta {
  color: var(--color-text-secondary);
}

@media (max-width: 1400px) {
  .note-list-item-preview {
    font-size: 14px;
  }

  .note-list-item-meta {
    font-size: 11px;
  }
}
</style>
