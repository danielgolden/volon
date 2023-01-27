<script lang="ts" setup>
import { PropType } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import { useSettingsStore } from "../stores/store.settings";
import { formatRelative } from "date-fns";

const settings = useSettingsStore();
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
</script>

<template>
  <li
    v-bind="$attrs"
    :class="{
      'active-note-list-item': genericState.activeNoteId === note.id,
      'note-list-item': true,
    }"
    :data-note-id="note.id"
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
    <!-- <Button type="secondary" icon="dots-horizontal" class="btn-note-options" /> -->
  </li>
</template>

<style scoped>
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
  font-size: 16px;
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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
</style>
