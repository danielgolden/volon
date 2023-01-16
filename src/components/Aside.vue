<script lang="ts" setup>
import { computed } from "vue";
import {
  getNoteById,
  sortNotesByModificationDate,
  navigateToPreviousNote,
  navigateToNextNote,
} from "../lib/utils";
import { signInWithGitHub, signout } from "../lib/supabase";
import { store } from "../store";
import AsideSearch from "./AsideSearch.vue";
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
</script>

<template>
  <Transition name="aside-toggle">
    <aside class="aside-container" v-if="store.loadedData.asideActive">
      <div style="position: absolute" v-if="false">
        <button @click="signInWithGitHub">Sign in with GitHub</button>
        <button @click="signout">logOut</button>
      </div>
      <AsideSearch :noteList="notesToBeDisplayed" />
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
      <span v-if="false"
        >Logged in via {{ store.session.user.app_metadata.provider }}</span
      >
      <span v-if="false">Using localStorage data</span>
    </aside>
  </Transition>
</template>

<style scoped>
.aside-container {
  display: grid;
  grid-area: aside;
  width: 350px;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-2);
}
.note-list {
  border-top: 1px solid var(--color-border-primary);
  overflow-y: auto;
  margin: 0;
  padding: 14px 12px;
  min-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.note-list-item {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  border-radius: 4px;
}

.note-list-item:hover {
  background-color: var(--color-bg-interactive-hover);
  cursor: pointer;
}

.note-list-item-preview {
  font-size: 17px;
  font-weight: 500;
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

.aside-toggle-leave-active {
  transition: width 150ms var(--ease-in-out-quad);
}
.aside-toggle-enter-active {
  transition: width 200ms var(--ease-out-quad);
}

.aside-toggle-leave-to,
.aside-toggle-enter-from {
  width: 0;
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
