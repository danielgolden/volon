import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueCodemirror from "vue-codemirror";
import { defaultKeymap } from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, drawSelection, keymap } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { editorTheme } from "./editorTheme";

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
  extensions: [
    markdown({
      base: markdownLanguage,
    }),
    editorTheme,
    EditorView.lineWrapping,
    EditorState.allowMultipleSelections.of(true),
    syntaxHighlighting(highlightStyle),
    drawSelection(),
    keymap.of(defaultKeymap),
  ],
  allowMultipleSelections: true,
};

const app = createApp(App);
app.use(VueCodemirror, codeMirrorOptions);
app.mount("#app");
