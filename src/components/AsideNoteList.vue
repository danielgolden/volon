<script lang="ts" setup>
import { useSettingsStore } from "../stores/store.settings";
import NoteListItem from "./NoteListItem.vue";
import AsideSearch from "./AsideSearch.vue";
import { onMounted, ref, computed, watch, nextTick } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";
import KeyboardShortcutIndicator from "./KeyboardShortcutIndicator.vue";
import {
  sortNotesByModificationDate,
  sortNotesByCreationDate,
  navigateToPreviousNote,
  navigateToNextNote,
  getIndexOfNoteById,
} from "../lib/utils";

const notebook = useNotebookStore();
const genericState = useGenericStateStore();
const settings = useSettingsStore();
const activeNoteSelectionMade = ref(false);
const noteListIsScrolled = ref(false);
const noteListUl = ref<HTMLUListElement | null>(null);

const searchIsActive = computed(() => {
  return genericState.noteListMatchingNotes !== null;
});

const notesToBeDisplayed = computed(() => {
  const sortingFunction =
    settings.noteOrderPreference === "dateModified"
      ? sortNotesByModificationDate
      : sortNotesByCreationDate;

  if (!searchIsActive.value || genericState.commandPaletteActive) {
    return sortingFunction(notebook.notes);
  } else {
    return sortingFunction(genericState.noteListMatchingNotes!);
  }
});

const handleNoteItemClick = (e: Event, noteId: string | null) => {
  if (noteId && noteId !== genericState.activeNoteId) {
    genericState.activeNoteId = noteId;
    genericState.activeNoteContents = notebook.getNoteById(
      genericState.activeNoteId
    ).content;

    if (genericState.commandPaletteActive) {
      genericState.toggleCommandPaletteActive();
    }
  }
};

const getActiveSelectionStatus = (noteListMatchingNotes?: Note[]) => {
  let selectionFoundInnoteListMatchingNotes = false;

  // selected item found in `noteListMatchingNotes`?
  if (noteListMatchingNotes) {
    selectionFoundInnoteListMatchingNotes = noteListMatchingNotes.some(
      (note: Note) => note.id === genericState.activeNoteId
    );
  }

  // selcted item in all `notesToBeDisplayed`?
  const selectionFoundAmongAllNotes = notesToBeDisplayed.value.some(
    (note: Note) => note.id === genericState.activeNoteId
  );

  return selectionFoundInnoteListMatchingNotes || selectionFoundAmongAllNotes;
};

const updateNoteListIsScrolled = () => {
  if (!noteListUl.value) return;
  const scrollPosition = noteListUl.value!.scrollTop;

  if (scrollPosition > 0) {
    noteListIsScrolled.value = true;
  } else {
    noteListIsScrolled.value = false;
  }
};

watch(
  () => genericState.noteListMatchingNotes as Note[],
  (newValue) => {
    activeNoteSelectionMade.value = getActiveSelectionStatus(newValue);
  }
);

onMounted(() => {
  if (settings.asideActive) {
    updateNoteListIsScrolled();

    noteListUl.value?.addEventListener("scroll", () => {
      updateNoteListIsScrolled();
    });
  }
});

watch(
  () => genericState.commandPaletteActive,
  (oldValue, newValue) => {
    if (!newValue) {
      genericState.selectedCommandPaletteNote = null;
    }
  }
);

watch(
  () => settings.asideActive,
  (newValue, oldValue) => {
    if (newValue) {
      nextTick(() => {
        noteListUl.value?.addEventListener("scroll", () => {
          updateNoteListIsScrolled();
        });
        updateNoteListIsScrolled();
      });
    } else {
      noteListUl.value?.removeEventListener("scroll", () => {
        updateNoteListIsScrolled();
      });
    }
  }
);

watch(
  () => genericState.activeNoteId,
  () => {
    if (!settings.asideActive) return;
    updateNoteListIsScrolled();
    const listItems = noteListUl.value!.querySelectorAll(".note-list-item");
    const activeListItem = (Array.from(listItems) as HTMLLIElement[]).find(
      (noteListItem) => {
        return noteListItem.dataset.noteId === genericState.activeNoteId;
      }
    );

    activeNoteSelectionMade.value = getActiveSelectionStatus(
      <Note[]>genericState.noteListMatchingNotes
    );

    // Find out of the selected note list item is scrolled into view
    // if not, scroll it into view
    if (activeListItem) {
      const noteListPosition = noteListUl.value!.getBoundingClientRect();
      const activeListItemPosition = activeListItem.getBoundingClientRect();
      const isAboveContainerViewport =
        activeListItemPosition.top < noteListPosition.top;
      const isBelowContainerViewport =
        activeListItemPosition.bottom > noteListPosition.bottom;
      const isOutsideContainerViewport =
        isAboveContainerViewport || isBelowContainerViewport;
      const indexOfActiveItem = getIndexOfNoteById(
        activeListItem.dataset.noteId!
      );

      if (isOutsideContainerViewport) {
        // R the function on the next iteration of the event loop
        nextTick(() => {
          activeListItem.scrollIntoView({
            behavior: "auto",
            block: "nearest",
          });
        });
      }

      if (isOutsideContainerViewport && indexOfActiveItem === 0) {
        noteListUl.value!.scrollTop = 0;
      }
    }
  }
);
</script>

<template>
  <Transition name="expand-aside">
    <div class="aside-note-list-container" v-if="settings.asideActive">
      <AsideSearch :noteList="notesToBeDisplayed" />
      <ul
        :class="{ 'note-list': true, scrolled: noteListIsScrolled }"
        tabindex="0"
        @keydown.up="navigateToPreviousNote(notesToBeDisplayed)"
        @keydown.down="navigateToNextNote(notesToBeDisplayed)"
        ref="noteListUl"
        v-show="notesToBeDisplayed.length"
      >
        <NoteListItem
          v-for="note in notesToBeDisplayed"
          :note="note"
          @click="(e) => handleNoteItemClick(e, note.id)"
        />
      </ul>
      <div class="empty-state" v-show="notesToBeDisplayed.length === 0">
        <p class="empty-state-description">
          <KeyboardShortcutIndicator value="↵" /> Create a new note
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.aside-note-list-container {
  --padding-block: 14px;
  display: flex;
  width: 350px;
  flex-shrink: 0;
  flex-direction: column;
  border-right: 1px solid var(--color-border-primary);
  background-color: var(--color-bg-surface-2);
  will-change: width;
}
.note-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 349px;
  margin: 0;
  padding: calc(var(--padding-block) / 2) 12px var(--padding-block);
  overflow-y: auto;
  position: relative;
  gap: 2px;
}

.note-list:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 1px var(--color-bg-interactive-focused);
}

.note-list.scrolled:focus-visible:before {
  box-shadow: inset 0 1px 0 var(--color-bg-interactive-focused);
}

.note-list:before {
  content: "";
  opacity: 0;
  display: block;
  height: 50px;
  margin-bottom: -50px;
  flex: none;
  width: 100%;
  position: sticky;
  top: calc((var(--padding-block) / 2) * -1);
  left: 0;
  right: 0;
  background-image: linear-gradient(
    180deg,
    var(--color-bg-surface-2) 10%,
    transparent
  );
  transition: opacity 200ms var(--ease-out-quad);
  pointer-events: none;
}

.note-list.scrolled:before {
  opacity: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
  width: 100%;
  height: 100%;
  margin: 0;
  color: var(--color-text-secondary);
}

.empty-state-description {
  margin: 0 0 4px 0;
}

.empty-state .keyboard-shortcut-indicator {
  margin-right: 3px;
}

.expand-aside-enter-active {
  transition: all 300ms var(--ease-out-quint);
}

.expand-aside-leave-active {
  transition: all 200ms var(--ease-in-out-quad);
}

.expand-aside-enter-from {
  width: 0;
}
.expand-aside-leave-to {
  width: 0;
}
.expand-aside-enter-active .note-list,
.expand-aside-enter-active .search-container {
  transition: translate 400ms var(--ease-out-quint),
    opacity 300ms var(--ease-out-quad), scale 300ms var(--ease-out-quad);
}
.expand-aside-leave-active .note-list,
.expand-aside-leave-active .search-container {
  transition: translate 400ms var(--ease-in-out-quad),
    opacity 200ms var(--ease-in-out-quad);
}
.expand-aside-enter-from .note-list,
.expand-aside-enter-from .search-container {
  translate: -8px;
  opacity: 0;
}
.expand-aside-leave-to .note-list,
.expand-aside-leave-to .search-container {
  translate: -14px;
  opacity: 0;
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

@media (max-width: 800px) {
  .aside-note-list-container {
    display: none;
  }
}
</style>
