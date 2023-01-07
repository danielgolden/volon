<script lang="ts" setup>
import { defineComponent, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { getNote, newNote } from "../utils";
import { store } from "../store";

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload) => {
  view.value = payload.view;
};

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
};
const saveCurrentNoteChange = (currentContent: string) => {
  getNote(store.activeNoteId).content = currentContent;
  localStorage.setItem("volon", JSON.stringify(store.loadedData));
};

const createNewNote = () => {
  const newNoteData = newNote();

  store.activeNoteId = newNoteData.id;
  store.loadedData.notes.push(newNoteData);
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
  height: 100%;
}
</style>
