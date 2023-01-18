<script lang="ts" setup>
import { computed, watch, ref, nextTick } from "vue";
import {
  getNoteById,
  sortNotesByModificationDate,
  navigateToPreviousNote,
  navigateToNextNote,
} from "../lib/utils";
import { store } from "../store";
import CommandPaletteInput from "./CommandPaletteInput.vue";
import KeyboardShortcutIndicator from "./KeyboardShortcutIndicator.vue";
import { formatRelative } from "date-fns";
import { useGenericStateStore } from "../stores/store.genericState";

const noteListItemRefs = ref<HTMLElement[] | []>([]);
const noteList = ref<HTMLUListElement | null>(null);
const totalNoteCount = computed(() => store.loadedData.notes.length);
const activeNoteSelectionMade = ref(false);
const genericState = useGenericStateStore();

const searchIsActive = computed(() => {
  return genericState.matchingNotes !== null;
});

const notesToBeDisplayed = computed(() => {
  if (!searchIsActive.value) {
    return sortNotesByModificationDate(store.loadedData.notes);
  } else {
    return sortNotesByModificationDate(genericState.matchingNotes!);
  }
});
const handleNoteItemClick = (noteId: string | null) => {
  if (noteId) {
    genericState.activeNoteId = noteId;
    genericState.activeNoteContents = getNoteById(
      genericState.activeNoteId
    ).content;
    genericState.toggleCommandPaletteActive();
  }
};
const formatRelativeDate = (relativeDate: string) => {
  const capitalizedFirstLetter = relativeDate[0].toUpperCase();
  const dateWithCapitalizedFirstChar =
    capitalizedFirstLetter + relativeDate.substring(1);

  return dateWithCapitalizedFirstChar.replace("AM", "am").replace("PM", "pm");
};

const getActiveSelectionStatus = (matchingNotes?: Note[]) => {
  let selectionFoundInMatchingNotes = false;

  // selected item found in `matchingNotes`?
  if (matchingNotes) {
    selectionFoundInMatchingNotes = matchingNotes.some(
      (note: Note) => note.id === genericState.activeNoteId
    );
  }

  // selcted item in all `notesToBeDisplayed`?
  const selectionFoundAmongAllNotes = notesToBeDisplayed.value.some(
    (note: Note) => note.id === genericState.activeNoteId
  );

  return selectionFoundInMatchingNotes || selectionFoundAmongAllNotes;
};

watch(
  () => genericState.matchingNotes as Note[],
  (newValue) => {
    activeNoteSelectionMade.value = getActiveSelectionStatus(newValue);
  }
);

watch(
  () => genericState.activeNoteId,
  () => {
    const activeListItem = noteListItemRefs.value.find(
      (noteListItem: HTMLElement) => {
        return noteListItem.dataset.noteId === genericState.activeNoteId;
      }
    );

    activeNoteSelectionMade.value = getActiveSelectionStatus(
      <Note[]>genericState.matchingNotes
    );

    // Find out of the selected note list item is scrolled into view
    // if not, scroll it into view
    if (activeListItem) {
      const noteListPosition = noteList.value!.getBoundingClientRect();
      const activeListItemPosition = activeListItem.getBoundingClientRect();

      const isAboveContainerViewport =
        activeListItemPosition.top < noteListPosition.top;
      const isBelowContainerViewport =
        activeListItemPosition.bottom > noteListPosition.bottom;

      const isOutsideContainerViewport =
        isAboveContainerViewport || isBelowContainerViewport;

      if (isOutsideContainerViewport) {
        // R the function on the next iteration of the event loop
        nextTick(() => {
          activeListItem.scrollIntoView({
            behavior: "auto",
            block: "nearest",
          });
        });
      }
    }
  }
);
</script>

<template>
  <div class="command-palette-wrapper">
    <Transition name="fade">
      <div
        class="overlay"
        @click="genericState.commandPaletteActive = false"
        v-show="genericState.commandPaletteActive"
      ></div>
    </Transition>
    <Transition name="lift">
      <section class="container" v-show="genericState.commandPaletteActive">
        <CommandPaletteInput :noteList="notesToBeDisplayed" />
        <ul
          v-if="notesToBeDisplayed.length > 0"
          class="note-list"
          tabindex="0"
          @keydown.up="navigateToPreviousNote(notesToBeDisplayed)"
          @keydown.down="navigateToNextNote(notesToBeDisplayed)"
          ref="noteList"
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
            @keydown.enter="genericState.toggleCommandPaletteActive"
            ref="noteListItemRefs"
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
        <div class="empty-state" v-if="notesToBeDisplayed.length === 0">
          <p class="empty-state-description">
            <KeyboardShortcutIndicator value="↵" /> Create a new note
          </p>
        </div>
        <footer class="command-palette-footer">
          <span
            class="footer-meta note-count"
            v-if="!genericState.matchingNotes"
            >{{ totalNoteCount }} notes</span
          >
          <span
            class="footer-meta query-results-count"
            v-if="genericState.matchingNotes"
            >{{ notesToBeDisplayed.length }} matching notes</span
          >
          <span
            class="footer-meta command-indicator"
            v-if="activeNoteSelectionMade"
            ><KeyboardShortcutIndicator value="↵" />Open note
          </span>
          <span
            class="footer-meta command-indicator"
            v-if="notesToBeDisplayed.length === 0"
            ><KeyboardShortcutIndicator value="↵" />Create note
          </span>
        </footer>
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
  background-color: rgb(10 13 17 / 70%);
}
.container {
  display: grid;
  max-width: 700px;
  width: 75%;
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
  box-shadow: 0px 30px 70px rgba(0, 0, 0, 0.35),
    0px 14px 34px rgba(0, 0, 0, 0.21), 0px 4px 7px rgba(0, 0, 0, 0.35);
  transform-origin: 0 0;
}

.search-input {
  height: 60px;
  font-size: 18px;
  padding-left: 20px;
  border-radius: 0;
  background-color: var(--color-bg-surface-1);
  border-bottom: 1px solid var(--color-border-secondary);
  box-shadow: none;
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
  scroll-margin: 10px;
}

.note-list-item:hover {
  background-color: var(--color-bg-indicator-high-contrast-inactive-hover);
  cursor: pointer;
}
.note-list-item-preview {
  font-size: 16px;
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

.command-palette-footer {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  border-top: 1px solid var(--color-border-secondary);
  background-color: var(--color-bg-surface-3);
}

.footer-meta {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.command-indicator .keyboard-shortcut-indicator {
  margin-right: 8px;
}
@media (max-width: 1400px) {
  .note-list-item-preview {
    font-size: 14px;
  }

  .note-list-item-meta {
    font-size: 11px;
  }
}

@media (max-width: 800px) {
  .container {
    width: 85%;
  }
}
</style>
