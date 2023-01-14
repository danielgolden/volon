<script lang="ts" setup>
import { computed, onMounted } from "vue";
import {
  getNoteById,
  sortNotesByModificationDate,
  navigateToPreviousNote,
  navigateToNextNote,
} from "../utils";
import { store } from "../store";
import CommandPaletteInput from "./CommandPaletteInput.vue";
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
    store.commandPaletteActive = !store.commandPaletteActive;
  }
};
const formatRelativeDate = (relativeDate: string) => {
  const capitalizedFirstLetter = relativeDate[0].toUpperCase();
  const dateWithCapitalizedFirstChar =
    capitalizedFirstLetter + relativeDate.substring(1);

  return dateWithCapitalizedFirstChar.replace("AM", "am").replace("PM", "pm");
};
</script>

<template>
  <div class="command-palette-wrapper">
    <Transition name="fade">
      <div
        class="overlay"
        @click="store.commandPaletteActive = false"
        v-show="store.commandPaletteActive"
      ></div>
    </Transition>
    <Transition name="lift">
      <section class="container" v-show="store.commandPaletteActive">
        <CommandPaletteInput :noteList="notesToBeDisplayed" />
        <ul
          v-if="notesToBeDisplayed.length > 0"
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
            @keydown.enter="
              store.commandPaletteActive = !store.commandPaletteActive
            "
          >
            <span class="note-list-item-preview">
              {{
                note.content.split(`\n`)[0].replaceAll("#", "").substring(0, 50)
              }}
              <em
                v-if="note.content.length === 0"
                class="empty-list-item-preview"
                >Empty note</em
              >
            </span>
            <span class="note-list-item-meta">{{
              formatRelativeDate(formatRelative(note.lastModified, new Date()))
            }}</span>
          </li>
        </ul>
        <p class="empty-state" v-if="notesToBeDisplayed.length === 0">
          Press Enter to create a note with the title "{{
            store.elementRefs.commandPaletterSearchInput?.value
          }}"
        </p>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.command-palette-wrapper {
  display: contents;
  transform-origin: top center;
}
.overlay {
  inset: 0;
  position: absolute;
  z-index: 10;
  background-color: rgb(0 0 0 / 35%);
}
.container {
  display: grid;
  max-width: 700px;
  width: 75%;
  min-width: 400px;
  height: 400px;
  position: absolute;
  z-index: 10;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-1);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary);
  box-shadow: 0px 30px 70px rgba(0, 0, 0, 0.15),
    0px 14px 34px rgba(0, 0, 0, 0.11), 0px 4px 7px rgba(0, 0, 0, 0.25);
  transform-origin: 0 0;
}

.search-input {
  height: 60px;
  font-size: 18px;
  padding-left: 24px;
  border-radius: 0;
  background-color: var(--color-bg-surface-1);
  border-bottom: 1px solid var(--color-border-secondary);
}

.search-input:focus {
  box-shadow: none;
}
.note-list {
  height: 100%;
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
  background-color: var(--color-bg-indicator-high-contrast-inactive-hover);
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
  background-color: var(--color-bg-indicator-high-contrast-active);
}

.active-note-list-item:hover {
  background-color: var(--color-bg-indicator-high-contrast-active);
}

.active-note-list-item .note-list-item-meta {
  color: var(--color-text-secondary);
}

.fade-enter-active {
  transition: opacity 100ms var(--ease-out-quad);
}
.fade-leave-active {
  transition: opacity 100ms var(--ease-out-quad);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.lift-enter-active {
  transition: all 100ms var(--ease-out-quad);
}

.lift-leave-active {
  transition: all 25ms var(--ease-in-out-quad);
}

.lift-enter-from {
  opacity: 0;
  translate: 0 8px;
  scale: 0.9875;
}
.lift-leave-to {
  opacity: 0;
}

.empty-state {
  display: grid;
  place-items: center;
  padding: 0 10%;
  width: 100%;
  height: 100%;
  margin: 0;
  color: var(--color-text-tertiary);
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
