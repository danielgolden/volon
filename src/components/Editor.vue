<script lang="ts" setup>
import { defineComponent, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { store } from "../store";

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload) => {
  view.value = payload.view;
};

const noteStuff = ref(`asdfasdf`);

// Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
  const state = view.value.state;
  const ranges = state.selection.ranges;
  const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
  const cursor = ranges[0].anchor;
  const length = state.doc.length;
  const lines = state.doc.lines;
  // more state info ...
  // return ...
};
</script>

<template>
  <codemirror
    v-model="store.noteContent"
    placeholder="Take notes..."
    :autofocus="true"
    :tab-size="2"
    :spellcheck="true"
    @ready="handleReady"
  />
</template>

<style>
.cm-editor {
  height: 100%;
}
</style>
