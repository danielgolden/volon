<script lang="ts" setup>
import { computed, onMounted } from "vue";
import {
  getNoteById,
  sortNotesByModificationDate,
  navigateToPreviousNote,
  navigateToNextNote,
} from "../utils";
import { store } from "../store";
import NoteSearchInput from "./NoteSearchInput.vue";
import { formatRelative } from "date-fns";

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
const formatRelativeDate = (relativeDate: string) => {
  const capitalizedFirstLetter = relativeDate[0].toUpperCase();
  const dateWithCapitalizedFirstChar =
    capitalizedFirstLetter + relativeDate.substring(1);

  return dateWithCapitalizedFirstChar.replace("AM", "am").replace("PM", "pm");
};

onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (store.asideActive === true) return;
    if (event.metaKey && event.code === "KeyK") {
      event.preventDefault();
      store.commandPaletteActive = !store.commandPaletteActive;
    }
  });
});
</script>

<template>
  <div class="command-paletter-wrapper">
    <div class="overlay"></div>
    <section class="container">
      <NoteSearchInput :noteList="notesToBeDisplayed" />
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
            {{
              note.content.split(`\n`)[0].replaceAll("#", "").substring(0, 50)
            }}
            <em v-if="note.content.length === 0" class="empty-list-item-preview"
              >Empty note</em
            >
          </span>
          <span class="note-list-item-meta">{{
            formatRelativeDate(formatRelative(note.lastModified, new Date()))
          }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.command-paletter-wrapper {
  display: contents;
}
.overlay {
  inset: 0;
  position: absolute;
  z-index: 10;
  background-color: rgb(0 0 0 / 25%);
}
.container {
  display: grid;
  max-width: 700px;
  width: 75%;
  min-width: 400px;
  height: 400px;
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-1);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary);
  box-shadow: 0px 30px 70px rgba(0, 0, 0, 0.15),
    0px 14px 34px rgba(0, 0, 0, 0.11), 0px 4px 7px rgba(0, 0, 0, 0.25);
}

.search-input {
  height: 60px;
  font-size: 16px;
  padding-left: 24px;
  border-radius: 0;
  background-color: var(--color-bg-surface-1);
}

.search-input:focus {
  box-shadow: none;
}
.note-list {
  height: 100%;
  border-top: 1px solid var(--color-border-secondary);
  overflow-y: auto;
  margin: 0;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 0px;
}
.note-list-item {
  padding: 4px 8px 7px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  border-radius: 4px;
  align-items: baseline;
  justify-content: space-between;
}

.note-list-item:hover {
  background-color: var(--color-bg-interactive-hover);
  cursor: pointer;
}

.note-list-item-preview {
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}

.note-list-item-meta {
  flex-shrink: 0;
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
/* 
@media (prefers-color-scheme: light) {
  .active-note-list-item .note-list-item-preview {
    color: var(--color-text-primary-interactive-inverted);
  }

  .active-note-list-item .note-list-item-meta {
    color: var(--color-text-secondary-interactive-inverted);
  }
} */

@media (max-width: 1400px) {
  .note-list-item-preview {
    font-size: 14px;
  }

  .note-list-item-meta {
    font-size: 11px;
  }
}
</style>
