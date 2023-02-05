<script lang="ts" setup>
import { PropType, onMounted, ref, watch } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import { useSettingsStore } from "../stores/store.settings";
import { formatRelative } from "date-fns";
import Menu from "./Menu.vue";
import { deleteActiveNote, createNewNote, Note } from "../lib/utils";
import { useElementRefsStore } from "../stores/store.elementRefs";

const noteListItem = ref<HTMLUListElement | null>(null);
const settings = useSettingsStore();
const elementRefs = useElementRefsStore();
const genericState = useGenericStateStore();
const props = defineProps({
  note: {
    required: true,
    type: Object as PropType<Note>,
  },
});

const formatRelativeDate = (relativeDate: string) => {
  const capitalizedFirstLetter = relativeDate[0].toUpperCase();
  const dateWithCapitalizedFirstChar =
    capitalizedFirstLetter + relativeDate.substring(1);

  return dateWithCapitalizedFirstChar.replace("AM", "am").replace("PM", "pm");
};

const renderNoteSecondaryContent = (note: Note) => {
  if (settings.notePreviewContents === "dateModified") {
    return formatRelativeDate(formatRelative(note.lastModified, new Date()));
  } else if (settings.notePreviewContents === "noteBody") {
    const noteBodyArray = note.content.split(`\n`).slice(1, 5);
    const firstCharOfNoteBodyIsSpace = !noteBodyArray[0];

    if (firstCharOfNoteBodyIsSpace) noteBodyArray.shift();

    return noteBodyArray.join(" ");
  }
};

const copyNoteUrlToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(
      `${location.origin}?noteId=${genericState.activeNoteId}`
    );
  } catch (err) {
    console.error("Failed to copy note URL to clipboard", err);
  }
};

const updateActiveListItemRef = () => {
  if (props.note.id === genericState.activeNoteId) {
    elementRefs.activeNoteListItem = noteListItem.value;
  }
};

const menuItems: MenuItem[] = [
  {
    label: "Copy link",
    onClick: copyNoteUrlToClipboard,
    icon: "link-2",
  },
  {
    label: "Duplicate",
    onClick: () => {
      createNewNote(genericState.activeNoteContents);
    },
    icon: "copy",
  },
  { type: "separator" },
  {
    label: "Delete",
    onClick: () => {
      deleteActiveNote();
      genericState.clearActiveNoteState();
    },
    icon: "trash",
    type: "destructive",
  },
];

watch(
  () => genericState.activeNoteId,
  () => {
    updateActiveListItemRef();
  }
);

onMounted(() => {
  updateActiveListItemRef();
});
</script>

<template>
  <li
    v-bind="$attrs"
    :class="{
      'active-note-list-item': genericState.activeNoteId === note.id,
      'note-list-item': true,
    }"
    :data-note-id="note.id"
    ref="noteListItem"
  >
    <span class="note-list-item-preview">
      {{ note.content.split(`\n`)[0].replaceAll("#", "").substring(0, 50) }}
      <em v-if="note.content.length === 0" class="empty-list-item-preview"
        >Empty note</em
      >
    </span>
    <span class="note-list-item-meta">{{
      renderNoteSecondaryContent(note)
    }}</span>
    <Menu
      :menu-items="menuItems"
      class="note-options-menu"
      buttonType="secondary"
      icon="dots-horizontal"
      :close-criteria="note.id !== genericState.activeNoteId"
    >
    </Menu>
  </li>
</template>

<style scoped>
.note-list-item {
  padding: 8px 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  grid-template-areas:
    "primaryContent primaryContent"
    "secondaryContent secondaryContent";
  align-items: center;
  row-gap: 2px;
  column-gap: 8px;
  border-radius: 4px;
}
.note-list-item:hover {
  grid-template-areas:
    "primaryContent noteActionsButton"
    "secondaryContent noteActionsButton";
  background-color: var(--color-bg-interactive-hover);
  cursor: pointer;
}
.note-list-item-preview {
  grid-area: primaryContent;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-primary);
}
.note-list-item-meta {
  grid-area: secondaryContent;
  font-size: 13px;
  color: var(--color-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.note-options-menu {
  display: none;
  grid-area: noteActionsButton;
}

.note-list-item:hover .note-options-menu,
.active-note-list-item .note-options-menu {
  display: block;
}

.active-note-list-item {
  grid-template-areas:
    "primaryContent noteActionsButton"
    "secondaryContent noteActionsButton";
}
.active-note-list-item:hover {
  background-color: transparent;
}
.active-note-list-item .note-list-item-meta {
  color: var(--color-text-secondary);
}
</style>
