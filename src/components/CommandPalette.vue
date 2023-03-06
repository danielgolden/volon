<script lang="ts" setup>
import { computed, watch, ref, nextTick, onMounted } from "vue";
import {
  sortNotesByModificationDate,
  sortNotesByCreationDate,
  navigateToPreviousNote,
  navigateToNextNote,
  deleteActiveNote,
  createNewNote,
  copyNoteUrlToClipboard,
} from "../lib/utils";
import { signInWithGitHub, signInWithGoogle, signout } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import CommandPaletteInput from "./CommandPaletteInput.vue";
import KeyboardShortcutIndicator from "./KeyboardShortcutIndicator.vue";
import Icon from "./Icon.vue";
import { downloadBackupOfData } from "../lib/utils";
import { useSettingsStore } from "../stores/store.settings";
import { useGenericStateStore } from "../stores/store.genericState";
import { useNotebookStore } from "../stores/store.notebook";
import { useUiStateStore } from "../stores/store.ui";
import {
  intializeLocalStorageData,
  saveAppSettingsToLocalStorage,
} from "../lib/localStorage";

const commandItemRefs = ref<HTMLElement[] | []>([]);
const noteList = ref<HTMLUListElement | null>(null);
const commandPaletteLists = ref<HTMLUListElement | null>(null);
const settings = useSettingsStore();
const genericState = useGenericStateStore();
const notebook = useNotebookStore();
const uiState = useUiStateStore();

const searchIsActive = computed(() => {
  return genericState.commandPaletteMatchingNotes !== null;
});

const notesToBeDisplayed = computed(() => {
  const sortingFunction =
    settings.noteOrderPreference === "dateModified"
      ? sortNotesByModificationDate
      : sortNotesByCreationDate;
  if (!searchIsActive.value) {
    return sortingFunction(notebook.notes);
  } else {
    return sortingFunction(genericState.commandPaletteMatchingNotes!);
  }
});

const createNoteItems = (notes: Note[]): CommandPaletteItem[] => {
  return notes.map((note): CommandPaletteItem => {
    return {
      type: "note",
      id: note.id!,
      icon: "file-text",
      label: notebook.getNoteTitle(note.content),
      meta: notebook.getNoteModifiedDate(note),
      action: () => {
        genericState.activeNoteId = note.id;
        genericState.activeNoteContents = notebook.getNoteById(note.id).content;
      },
      selected: false,
    };
  });
};

const currentNoteCommands = computed((): CommandPaletteItem[] => {
  if (genericState.activeNoteId) {
    return [
      {
        type: "command",
        id: uuidv4(),
        label: "Delete current note",
        icon: "trash",
        keywords: "remove, commands",
        action: () => {
          deleteActiveNote();
          genericState.clearActiveNoteState();
        },
        selected: false,
      },
      {
        type: "command",
        id: uuidv4(),
        label: "Duplicate current note",
        icon: "copy",
        keywords: "commands, copy",
        action: () => createNewNote(genericState.activeNoteContents),
        selected: false,
      },
      {
        type: "command",
        id: uuidv4(),
        label: "Copy current note link",
        icon: "link-2",
        keywords: "commands",
        action: () => copyNoteUrlToClipboard(),
        selected: false,
      },
    ];
  } else {
    return [];
  }
});

const sessionCommands = (): CommandPaletteItem[] => {
  if (!genericState.userIsLoggedIn) {
    return [
      {
        type: "command",
        id: uuidv4(),
        label: "Login with GitHub",
        icon: "enter",
        keywords: "commands",
        action: () => signInWithGitHub(),
        selected: false,
      },
      {
        type: "command",
        id: uuidv4(),
        label: "Login with Google",
        icon: "enter",
        keywords: "commands",
        action: () => signInWithGoogle(),
        selected: false,
      },
    ];
  } else {
    return [
      {
        type: "command",
        id: uuidv4(),
        label: "Log out",
        icon: "exit",
        keywords: "commands",
        action: () => {
          signout();
          intializeLocalStorageData();
          genericState.clearActiveNoteState();
        },
        selected: false,
      },
    ];
  }
};

const rawCommands = computed((): CommandPaletteItem[] => [
  {
    type: "command",
    id: uuidv4(),
    label: "Toggle theme",
    icon: "sun",
    keywords: "dark, light, mode, commands",
    action: () => {
      settings.theme = settings.themeResult === "dark" ? "light" : "dark";
      saveAppSettingsToLocalStorage();
    },
    selected: false,
  },
  {
    type: "command",
    id: uuidv4(),
    label: "Open settings",
    icon: "settings",
    keywords: "preferences, commands",
    action: () => (uiState.settingsViewActive = true),
    selected: false,
  },
  {
    type: "command",
    id: uuidv4(),
    label: settings.markdownPreviewActive
      ? "Hide markdown preview"
      : "Show markdown preview",
    icon: settings.markdownPreviewActive ? "eye-closed" : "eye-open",
    keywords: "split, commands",
    action: () => settings.toggleMarkdownPreviewActive(),
    selected: false,
  },
  {
    type: "command",
    id: uuidv4(),
    label: "Open settings",
    icon: "settings",
    keywords: "preferences, commands",
    action: () => (uiState.settingsViewActive = true),
    selected: false,
  },
  ...sessionCommands(),
  {
    type: "command",
    id: uuidv4(),
    label: "Download a backup",
    keywords: "commands",
    icon: "download",
    action: () => downloadBackupOfData(),
    selected: false,
  },
  {
    type: "command",
    id: uuidv4(),
    label: "Sync scrolling",
    icon: "height",
    keywords: "commands",
    action: () => {
      settings.syncScroll = true;
      saveAppSettingsToLocalStorage();
    },
    selected: false,
  },
  ...currentNoteCommands.value,
]);

const commandsToBeDisplayed = () => {
  return rawCommands.value.filter((command) => {
    return (
      command.label
        .toLocaleLowerCase()
        .includes(genericState.commandPaletteCurrentQuery.toLowerCase()) ||
      command.keywords
        ?.toLowerCase()
        .includes(genericState.commandPaletteCurrentQuery.toLowerCase())
    );
  });
};

const searchReturnedNoResults = () => {
  return (
    commandsToBeDisplayed().length === 0 &&
    notesToBeDisplayed.value.length === 0
  );
};

const commandItemsToBeDisplayed = computed(() => [
  ...createNoteItems(notesToBeDisplayed.value),
  ...commandsToBeDisplayed(),
]);

const defaultCommandItems = computed(() => [
  ...createNoteItems(notesToBeDisplayed.value).slice(0, 5),
  ...rawCommands.value,
]);

const getIndexOfSelectedCommandItem = () => {
  const commandItems = genericState.commandPaletteCurrentQuery
    ? commandItemsToBeDisplayed
    : defaultCommandItems;
  let indexOfSelectedItem = 0;
  commandItems.value.forEach((item, index) => {
    if (item.id === genericState.selectedCommandPaletteItem?.id) {
      indexOfSelectedItem = index;
      ``;
    }
  });

  return indexOfSelectedItem;
};

// When palette opens, select first item
watch(
  () => uiState.commandPaletteActive,
  () => {
    setTimeout(() => {
      genericState.selectedCommandPaletteItem =
        commandItemsToBeDisplayed.value[0];
    }, 300);
  }
);

// Ensure the list scrolls to contain the selected item
watch(
  () => genericState.selectedCommandPaletteItem,
  () => {
    const activeListItem = commandItemRefs.value.find(
      (commandItem: HTMLElement) => {
        return (
          commandItem.dataset.itemId ===
          genericState.selectedCommandPaletteItem?.id
        );
      }
    );

    // Find out of the selected item is scrolled into view
    // if not, scroll it into view
    if (activeListItem) {
      const listContainerPosition =
        commandPaletteLists.value!.getBoundingClientRect();
      const activeListItemPosition = activeListItem.getBoundingClientRect();

      const isAboveContainerViewport =
        activeListItemPosition.top < listContainerPosition.top;
      const isBelowContainerViewport =
        activeListItemPosition.bottom > listContainerPosition.bottom;

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

    // If the selected item is the first item, scroll the container
    // to the top to ensure it's section label is visible
    if (getIndexOfSelectedCommandItem() === 0) {
      nextTick(() => {
        commandPaletteLists.value?.scrollTo(0, 0);
      });
    }
  }
);

onMounted(() => {
  // When the component loads, set a selected item
  genericState.selectedCommandPaletteItem = createNoteItems(
    notesToBeDisplayed.value
  )[0];
});
</script>

<template>
  <div class="command-palette-wrapper">
    <Transition name="fade">
      <div
        class="overlay"
        @click="uiState.commandPaletteActive = false"
        v-show="uiState.commandPaletteActive"
      ></div>
    </Transition>
    <Transition name="lift">
      <section class="container" v-show="uiState.commandPaletteActive">
        <CommandPaletteInput
          :items="
            genericState.commandPaletteCurrentQuery
              ? commandItemsToBeDisplayed
              : defaultCommandItems
          "
        />
        <section
          class="command-palette-lists"
          v-if="!searchReturnedNoResults()"
          ref="commandPaletteLists"
        >
          <h5
            class="command-palette-list-heading"
            v-if="genericState.commandPaletteCurrentQuery"
          >
            Results
          </h5>
          <h5
            class="command-palette-list-heading"
            v-if="!genericState.commandPaletteCurrentQuery"
          >
            {{
              genericState.commandPaletteCurrentQuery ? "Notes" : "Recent notes"
            }}
          </h5>
          <ul
            v-if="notesToBeDisplayed.length > 0"
            class="note-list command-palette-list"
            tabindex="0"
            @keydown.up="navigateToPreviousNote(notesToBeDisplayed)"
            @keydown.down="navigateToNextNote(notesToBeDisplayed)"
            ref="noteList"
          >
            <li
              v-for="noteItem in genericState.commandPaletteCurrentQuery
                ? createNoteItems(notesToBeDisplayed)
                : createNoteItems(notesToBeDisplayed).slice(0, 5)"
              :v-key="noteItem.id"
              :class="{
                'active-command-palette-item':
                  genericState.selectedCommandPaletteItem?.id === noteItem.id,
                'command-palette-item': true,
              }"
              @click="
                () => {
                  noteItem.action();
                  uiState.toggleCommandPaletteActive();
                }
              "
              @keydown.enter="
                () => {
                  noteItem.action();
                  uiState.toggleCommandPaletteActive();
                }
              "
              ref="commandItemRefs"
              :data-item-id="noteItem.id"
            >
              <span class="command-label-container">
                <Icon v-if="noteItem.icon" :name="noteItem.icon" />
                <span class="command-palette-item-label">
                  {{ noteItem.label }}
                </span>
                <em
                  v-if="notebook?.getNoteById(noteItem.id).content.length === 0"
                  class="empty-list-item-preview"
                  >Empty note</em
                >
              </span>
              <span class="command-palette-item-meta">{{ noteItem.meta }}</span>
            </li>
          </ul>
          <h5
            class="command-palette-list-heading"
            v-if="!genericState.commandPaletteCurrentQuery"
          >
            Commands
          </h5>
          <ul
            v-if="commandsToBeDisplayed().length > 0"
            class="command-list command-palette-list"
            tabindex="0"
            @keydown.up="navigateToPreviousNote(notesToBeDisplayed)"
            @keydown.down="navigateToNextNote(notesToBeDisplayed)"
            ref="noteList"
          >
            <li
              v-for="command in commandsToBeDisplayed()"
              :v-key="command.label"
              :class="{
                'command-palette-item': true,
                'active-command-palette-item':
                  genericState.selectedCommandPaletteItem?.id === command.id,
              }"
              @click="
                {
                  command.action();
                  uiState.toggleCommandPaletteActive();
                }
              "
              @keydown.enter="
                {
                  command.action();
                  uiState.toggleCommandPaletteActive();
                }
              "
              ref="commandItemRefs"
              :data-item-id="command.id"
            >
              <span class="command-label-container">
                <Icon v-if="command.icon" :name="command.icon" />
                <span class="command-palette-item-label">
                  {{ command.label }}
                </span>
              </span>
              <span class="command-palette-item-meta">Command</span>
            </li>
          </ul>
        </section>
        <div class="empty-state" v-if="searchReturnedNoResults()">
          <p class="empty-state-description">
            <KeyboardShortcutIndicator value="↵" /> Create a new note
          </p>
        </div>
        <footer class="command-palette-footer">
          <span
            class="footer-meta note-count"
            v-if="!genericState.commandPaletteMatchingNotes"
            >{{ notebook.totalNotesCount }} notes</span
          >
          <span
            class="footer-meta query-results-count"
            v-if="genericState.commandPaletteMatchingNotes"
            >{{ commandItemsToBeDisplayed.length }} results</span
          >
          <span
            class="footer-meta command-indicator"
            v-if="genericState.selectedCommandPaletteItem?.type === 'note'"
            ><KeyboardShortcutIndicator value="↵" />Open note
          </span>
          <span
            class="footer-meta command-indicator"
            v-if="genericState.selectedCommandPaletteItem?.type === 'command'"
            ><KeyboardShortcutIndicator value="↵" />Run command
          </span>
          <span
            class="footer-meta command-indicator"
            v-if="searchReturnedNoResults()"
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
  z-index: 100;
  background-color: var(--color-bg-overlay);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}
.container {
  display: grid;
  max-width: 700px;
  width: 75%;
  height: 443px;
  position: absolute;
  z-index: 100;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-1);
  border-radius: 8px;
  border: 1px solid var(--color-border-primary);
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
  border-bottom: 1px solid var(--color-border-primary);
  box-shadow: none;
}

.search-input:focus {
  box-shadow: none;
}

.command-palette-lists {
  height: 100%;
  overflow: auto;
}

.command-palette-list-heading {
  margin: 20px 0 6px;
  padding-left: 20px;
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.command-palette-list-heading:first-child {
  margin-top: 16px;
}
.command-palette-list {
  overflow-y: auto;
  margin: 0;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.command-palette-list:first-child {
  padding-top: 14px;
}

.command-palette-list:last-child {
  padding-bottom: 14px;
}

.command-label-container {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;
}
.command-palette-item {
  padding: 5px 8px 6px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
  scroll-margin: 10px;
}

.command-palette-item:hover {
  background-color: var(--color-bg-indicator-high-contrast-inactive-hover);
  cursor: pointer;
}
.command-palette-item-label {
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}

.command-palette-item-meta {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-tertiary);
}

.active-command-palette-item {
  background-color: var(--color-bg-indicator-high-contrast-active);
}

.active-command-palette-item:hover {
  background-color: var(--color-bg-indicator-high-contrast-active);
}

.active-command-palette-item .command-palette-item-meta {
  color: var(--color-text-secondary);
}

.fade-enter-active {
  transition: opacity 350ms var(--ease-out-quint);
}
.fade-leave-active {
  transition: opacity 100ms var(--ease-out-quad);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.lift-enter-active {
  transition: all 450ms var(--ease-out-quint);
  /* transition-delay: 50ms; */
}

.lift-leave-active {
  transition: all 25ms var(--ease-in-out-quad);
}

.lift-enter-from {
  opacity: 0;
  translate: 0 7px;
  scale: 0.98;
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
  border-top: 1px solid var(--color-border-primary);
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
