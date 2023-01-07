<script lang="ts" setup>
import { computed } from "vue";
import { getNoteById, sortNotesByModificationDate } from "../utils";
import { store } from "../store";
import AsideSearch from "./AsideSearch.vue";

const searchIsActive = computed(() => {
  return store.matchingNotes !== null;
});

const notesToBeDisplayed = computed(() => {
  if (!searchIsActive.value) {
    return sortNotesByModificationDate(store.loadedData.notes);
  } else {
    return sortNotesByModificationDate(store.matchingNotes);
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
    <ul class="note-list">
      <li
        v-for="note in notesToBeDisplayed"
        :v-key="note.id"
        :class="{
          'active-note': store.activeNoteId === note.id,
          'note-list-item': true,
        }"
        :data-note-id="note.id"
        @click="handleNoteItemClick(note.id)"
      >
        <span class="note-list-item-preview">{{
          note.content.substring(0, 50)
        }}</span>
        <span class="note-list-item-meta">{{ note.lastModified }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
aside {
  background-color: var(--color-bg-surface-2);
}
.note-list {
  margin: 0;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.note-list-item {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-list-item-preview {
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}

.note-list-item-meta {
  font-size: 11px;
  color: var(--color-text-tertiary);
}
</style>
