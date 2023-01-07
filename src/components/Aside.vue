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
        <span class="note-list-item">{{ note.content.substring(0, 50) }}</span>
        <span class="note-list-item-meta">{{ note.lastModified }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.note-list-item {
  display: flex;
  flex-direction: column;
}
</style>
