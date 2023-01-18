<script lang="ts" setup>
import { watch, onMounted, ref, shallowRef } from "vue";
import { saveCurrentNoteChange, createNewNote } from "../lib/utils";
import { store } from "../store";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import {
  EditorState,
  StateCommand,
  Text,
  EditorSelection,
  Transaction,
} from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  syntaxHighlighting,
  HighlightStyle,
  indentUnit,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { editorTheme } from "../editorTheme";
import {
  EditorView,
  drawSelection,
  keymap,
  ViewUpdate,
  placeholder,
} from "@codemirror/view";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { useGenericStateStore } from "../stores/store.genericState";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps(["modelValue"]);
const codemirrorContainer = ref<Element | null>(null);
let myCodemirrorView = new EditorView();
const codeMirrorTriggeredNoteCreation = ref(false);
let onChangeTimer = ref(setTimeout(() => {}, 0));
const elementRefs = useElementRefsStore();
const genericState = useGenericStateStore();

const handleOnChange = (update: ViewUpdate) => {
  const waitTime = 500; // in milliseconds
  clearTimeout(onChangeTimer.value);

  if (!update.docChanged) return;
  const currentContent = update.view.state.doc.toString();

  if (genericState.activeNoteId) {
    emit("update:modelValue", currentContent);
    onChangeTimer.value = setTimeout(() => {
      saveCurrentNoteChange(currentContent);
    }, waitTime);
  } else {
    createNewNote();
    emit("update:modelValue", currentContent);
    onChangeTimer.value = setTimeout(() => {
      saveCurrentNoteChange(currentContent);
    }, waitTime);

    codeMirrorTriggeredNoteCreation.value = true;
  }
};

const insertBoldMarker: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const isBoldBefore = state.sliceDoc(range.from - 2, range.from) === "**";
    const isBoldAfter = state.sliceDoc(range.to, range.to + 2) === "**";
    const changes = [];

    changes.push(
      isBoldBefore
        ? {
            from: range.from - 2,
            to: range.from,
            insert: Text.of([""]),
          }
        : {
            from: range.from,
            insert: Text.of(["**"]),
          }
    );

    changes.push(
      isBoldAfter
        ? {
            from: range.to,
            to: range.to + 2,
            insert: Text.of([""]),
          }
        : {
            from: range.to,
            insert: Text.of(["**"]),
          }
    );

    const extendBefore = isBoldBefore ? -2 : 2;
    const extendAfter = isBoldAfter ? -2 : 2;

    return {
      changes,
      range: EditorSelection.range(
        range.from + extendBefore,
        range.to + extendAfter
      ),
    };
  });

  dispatch(
    state.update(changes, {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of("input"),
    })
  );

  return true;
};

const insertItalicMarker: StateCommand = ({ state, dispatch }) => {
  const changes = state.changeByRange((range) => {
    const isItalicBefore = state.sliceDoc(range.from - 1, range.from) === "*";
    const isItalicAfter = state.sliceDoc(range.to, range.to + 1) === "*";
    const changes = [];

    changes.push(
      isItalicBefore
        ? {
            from: range.from - 1,
            to: range.from,
            insert: Text.of([""]),
          }
        : {
            from: range.from,
            insert: Text.of(["*"]),
          }
    );

    changes.push(
      isItalicAfter
        ? {
            from: range.to,
            to: range.to + 1,
            insert: Text.of([""]),
          }
        : {
            from: range.to,
            insert: Text.of(["*"]),
          }
    );

    const extendBefore = isItalicBefore ? -1 : 1;
    const extendAfter = isItalicAfter ? -1 : 1;

    return {
      changes,
      range: EditorSelection.range(
        range.from + extendBefore,
        range.to + extendAfter
      ),
    };
  });

  dispatch(
    state.update(changes, {
      scrollIntoView: true,
      annotations: Transaction.userEvent.of("input"),
    })
  );

  return true;
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
      indentUnit.of("    "),
      keymap.of([
        {
          key: "Mod-i",
          run: insertItalicMarker,
        },
        ...defaultKeymap,
        {
          key: "Mod-v",
          run: handleCommandV,
        },
        {
          key: "Mod-b",
          run: insertBoldMarker,
        },
        indentWithTab,
      ]),
    ],
    allowMultipleSelections: true,
    parent: codemirrorContainer.value!,
    placeholder: "do a thing",
  };

  myCodemirrorView = new EditorView(codeMirrorOptions);
  elementRefs.codeMirror = myCodemirrorView;
};

onMounted(() => {
  resetCodemirrorView();
});

// When the activeNoteId changes, reset the view for the incoming note
watch(
  () => genericState.activeNoteId,
  () => {
    resetCodemirrorView();
    if (
      codeMirrorTriggeredNoteCreation.value ||
      genericState.searchJustCreatedNote
    ) {
      const codeMirrorContentsLength = myCodemirrorView.state.doc.length;
      myCodemirrorView.focus();
      myCodemirrorView.dispatch({
        selection: { anchor: codeMirrorContentsLength },
      });

      genericState.searchJustCreatedNote = false;
      codeMirrorTriggeredNoteCreation.value = false;
    }
  }
);

const handleCommandV = () => {
  const controlledPaste = async () => {
    const firstSelection = myCodemirrorView.state.selection.ranges.at(0)!;
    const selectionText = myCodemirrorView.state.doc
      .toString()
      .substring(firstSelection.from, firstSelection.to);
    const clipBoardText = await navigator.clipboard.readText();
    const isURL =
      clipBoardText.startsWith("https://") ||
      clipBoardText.startsWith("http://") ||
      clipBoardText.startsWith("www");

    if (selectionText && isURL) {
      myCodemirrorView.dispatch(
        myCodemirrorView.state.replaceSelection(
          `[${selectionText}](${clipBoardText})`
        )
      );
    } else {
      myCodemirrorView.dispatch(
        myCodemirrorView.state.replaceSelection(clipBoardText)
      );
    }
  };

  controlledPaste();
  return true;
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
.cm-editor .cm-content {
  padding: 48px;
  font-size: 20px;
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
  .cm-editor .cm-content {
    font-size: 18px;
  }

  .md-monospace {
    font-size: 15px;
  }
}

@media (max-width: 800px) {
  .cm-editor .cm-content {
    padding: 24px;
  }
}
</style>
