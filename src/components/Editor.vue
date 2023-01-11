<script lang="ts" setup>
import { watch, onMounted, ref, shallowRef } from "vue";
import { saveCurrentNoteChange, createNewNote } from "../utils";
import { store } from "../store";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { editorTheme } from "../editorTheme";
import {
  EditorView,
  drawSelection,
  keymap,
  ViewUpdate,
  placeholder,
} from "@codemirror/view";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps(["modelValue"]);
const codemirrorContainer = ref<Element | null>(null);
let myCodemirrorView = new EditorView();
const codeMirrorTriggeredNoteCreation = ref(false);

const handleOnChange = (update: ViewUpdate) => {
  if (!update.docChanged) return;
  const currentContent = update.view.state.doc.toString();

  if (store.activeNoteId) {
    emit("update:modelValue", currentContent);
    saveCurrentNoteChange(currentContent);
  } else {
    createNewNote();
    emit("update:modelValue", currentContent);
    saveCurrentNoteChange(currentContent);

    codeMirrorTriggeredNoteCreation.value = true;
  }
};

const resetCodemirrorView = () => {
  myCodemirrorView.destroy();

  const highlightStyle = HighlightStyle.define([
    { tag: tags.strikethrough, class: "md-strikethrough" },
    {
      tag: [
        tags.heading1,
        tags.heading2,
        tags.heading3,
        tags.heading4,
        tags.heading5,
        tags.heading6,
      ],
      class: "md-header",
    },
    { tag: tags.emphasis, fontStyle: "italic", class: "md-emphasis" },
    { tag: tags.strong, fontWeight: "600", class: "md-strong" },
    { tag: tags.monospace, class: "md-monospace" },
    { tag: tags.meta, class: "md-meta" },
    { tag: tags.link, class: "md-link" },
  ]);

  const codeMirrorOptions = {
    doc: props.modelValue,
    extensions: [
      markdown({
        base: markdownLanguage,
      }),
      editorTheme,
      placeholder("Jot something down..."),
      EditorView.lineWrapping,
      EditorState.allowMultipleSelections.of(true),
      EditorView.updateListener.of((update) => handleOnChange(update)),
      syntaxHighlighting(highlightStyle),
      drawSelection(),
      keymap.of([
        ...defaultKeymap,
        { key: "Mod-v", run: handleCommandV },
        indentWithTab,
      ]),
    ],
    allowMultipleSelections: true,
    parent: codemirrorContainer.value!,
    placeholder: "do a thing",
  };

  myCodemirrorView = new EditorView(codeMirrorOptions);
  store.elementRefs.codeMirror = myCodemirrorView;
};

onMounted(() => {
  resetCodemirrorView();
});

// When the activeNoteId changes, reset the view for the incoming note
watch(
  () => store.activeNoteId,
  () => {
    resetCodemirrorView();
    if (codeMirrorTriggeredNoteCreation.value || store.searchJustCreatedNote) {
      const codeMirrorContentsLength = myCodemirrorView.state.doc.length;
      myCodemirrorView.focus();
      myCodemirrorView.dispatch({
        selection: { anchor: codeMirrorContentsLength },
      });

      store.searchJustCreatedNote = false;
      codeMirrorTriggeredNoteCreation.value = false;
    }
  }
);

const handleCommandV = () => {
  console.log("pasted attempted!");
  return false;
};
</script>

<template>
  <div class="codemirror-container" ref="codemirrorContainer"></div>
</template>

<style>
.codemirror-container {
  display: contents;
}

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
