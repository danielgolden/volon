<script lang="ts" setup>
import { useSettingsStore } from "../stores/store.settings";
import AsideSearch from "./AsideSearch.vue";
import { onMounted, ref, computed, watch, nextTick } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";
import { formatRelative } from "date-fns";
import KeyboardShortcutIndicator from "./KeyboardShortcutIndicator.vue";
import {
  sortNotesByModificationDate,
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
const noteListItemRefs = ref<HTMLElement[] | []>([]);

const searchIsActive = computed(() => {
  return genericState.noteListMatchingNotes !== null;
});

const notesToBeDisplayed = computed(() => {
  if (!searchIsActive.value || genericState.commandPaletteActive) {
    return sortNotesByModificationDate(notebook.notes);
  } else {
    return sortNotesByModificationDate(genericState.noteListMatchingNotes!);
  }
});
const handleNoteItemClick = (noteId: string | null) => {
  if (noteId) {
    genericState.activeNoteId = noteId;
    genericState.activeNoteContents = notebook.getNoteById(
      genericState.activeNoteId
    ).content;

    if (genericState.commandPaletteActive) {
      genericState.toggleCommandPaletteActive();
    }
  }
};
const formatRelativeDate = (relativeDate: string) => {
  const capitalizedFirstLetter = relativeDate[0].toUpperCase();
  const dateWithCapitalizedFirstChar =
    capitalizedFirstLetter + relativeDate.substring(1);

  return dateWithCapitalizedFirstChar.replace("AM", "am").replace("PM", "pm");
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
  () => genericState.activeNoteId,
  () => {
    updateNoteListIsScrolled();

    const activeListItem = noteListItemRefs.value.find(
      (noteListItem: HTMLElement) => {
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
        <li
          v-for="note in notesToBeDisplayed"
          :v-key="note.id"
          :class="{
            'active-note-list-item': genericState.activeNoteId === note.id,
            'note-list-item': true,
          }"
          :data-note-id="note.id"
          @click="handleNoteItemClick(note.id)"
          ref="noteListItemRefs"
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
  overflow: hidden;
  border-right: 1px solid var(--color-border-secondary);
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
  box-shadow: inset 0 0 0 2px var(--color-text-tertiary);
}

.note-list.scrolled:focus-visible:before {
  box-shadow: inset 0 2px 0 var(--color-text-tertiary);
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
    opacity 300ms var(--ease-out-quad);
}
.expand-aside-leave-active .note-list,
.expand-aside-leave-active .search-container {
  transition: translate 400ms var(--ease-in-out-quad),
    opacity 200ms var(--ease-in-out-quad);
}
.expand-aside-enter-from .note-list {
  translate: 0 8px;
  opacity: 0;
}
.expand-aside-enter-from .search-container {
  translate: 0 -8px;
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
