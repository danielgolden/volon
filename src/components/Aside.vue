<script lang="ts" setup>
import { ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { getNote } from "../utils";
import { store } from "../store";

const currentQuery = ref(``);
const handleNoteItemClick = (noteId: string | null) => {
  if (noteId) {
    store.activeNoteId = noteId;
    store.activeNoteContents = getNote(store.activeNoteId).content;
  }
};
</script>

<template>
  <aside>
    <input type="text" v-model="currentQuery" />
    <ul>
      <li
        v-for="note in store.loadedData.notes"
        :v-key="note.id"
        :class="{
          'active-note': store.activeNoteId === note.id,
          'note-list-item': true,
        }"
        :data-note-id="note.id"
        @click="handleNoteItemClick(note.id)"
      >
        <span class="note-list-item">{{ note.name }}</span>
        <span class="note-list-item-meta">{{ note.lastModified }}</span>
      </li>
    </ul>
  </aside>
</template>

<style>
.cm-editor {
  height: 100%;
}
</style>
