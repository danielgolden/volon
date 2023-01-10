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
  { tag: tags.strikethrough, textDecoration: "line-through" },
  {
    tag: [
      tags.heading1,
      tags.heading2,
      tags.heading3,
      tags.heading4,
      tags.heading5,
      tags.heading6,
    ],
    fontWeight: "600",
  },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "600" },
  // { tag: tags.link, color: "var(--color-text-tertiary)" },
  {
    tag: tags.monospace,
    fontFamily: `var(--font-family-monospace)`,
    fontSize: "14px",
    opacity: ".7",
    lineHeight: "100%",
  },
  { tag: tags.meta, color: "var(--color-text-secondary)", fontWeight: "400" },
  {
    tag: tags.link,
    color: "var(--color-text-secondary)",
  },
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
