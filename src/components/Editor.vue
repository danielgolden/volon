<script lang="ts" setup>
import { defineComponent, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { saveCurrentNoteChange, createNewNote } from "../utils";
import { store } from "../store";

// Codemirror EditorView instance ref
const view = shallowRef();
const handleReady = (payload: any) => {
  view.value = payload.view;
  store.elementRefs.codeMirror = view.value;
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
    placeholder="Jot something down..."
    :autofocus="true"
    :tab-size="2"
    :spellcheck="true"
    @ready="handleReady"
    @change="(currentContent) => handleOnChange(currentContent)"
  />
</template>

<style>
.cm-editor {
  grid-area: editor;
  align-items: center;
  height: 100%;
  background-color: var(--color-bg-surface-1);
}

.cm-scroller {
  width: 100%;
  justify-content: center;
}

.cm-editor.cm-focused {
  outline: none;
}

/*-- Custom syntax highlighting --*/
.md-header {
  font-weight: 600;
}

.md-emphasis {
  font-style: italic;
}

.md-storng {
  font-weight: 600;
}

.md-strikethrough {
  text-decoration: line-through;
}

.md-monospace {
  font-family: var(--font-family-monospace);
  font-size: 18px;
  opacity: 0.7;
  line-height: 100%;
}

.md-meta {
  font-weight: 400;
  color: var(--color-text-secondary);
  font-style: normal;
  text-decoration: none;
}

.md-link {
  color: var(--color-text-secondary);
}

@media (max-width: 1400px) {
  .v-codemirror .cm-content {
    font-size: 16px;
  }

  .md-monospace {
    font-size: 14px;
  }
}
</style>
