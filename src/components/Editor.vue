<script lang="ts" setup>
import { defineComponent, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { saveCurrentNoteChange, createNewNote } from "../utils";
import { store } from "../store";

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload: any) => {
  view.value = payload.view;
};

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce(
    (r: any, range: any) => r + range.to - range.from,
    0
  );
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
};

const handleOnChange = (currentContent: string) => {
  if (store.activeNoteId) {
    saveCurrentNoteChange(currentContent);
  } else {
    createNewNote();
    saveCurrentNoteChange(currentContent);
  }
};
</script>

<template>
  <codemirror
    v-model="store.activeNoteContents"
    placeholder="Take notes..."
    :autofocus="true"
    :tab-size="2"
    :spellcheck="true"
    @ready="handleReady"
    @change="(currentContent) => handleOnChange(currentContent)"
  />
</template>

<style>
.cm-editor {
  padding: 48px;
  align-items: center;
  height: 100%;
  background-color: var(--color-bg-surface-1);
}

.cm-scroller {
  width: 100%;
  justify-content: center;
}

@media (max-width: 1400px) {
  .v-codemirror .cm-content {
    font-size: 16px;
  }
}
</style>
