import { EditorView } from "@codemirror/view";

export const editorTheme = EditorView.theme(
  {
    "&": {
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    ".cm-content": {
      maxWidth: "70ch",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: "150%",
      fontFamily: "var(--font-family-primary)",
      caretColor: "var(--color-text-primary)",
      color: "var(--color-text-primary)",
    },
    ".cm-editor": {
      height: "100%",
      width: "100%",
      padding: "48px",
    },
    ".cm-placeholder": {
      color: "var(--color-text-tertiary)",
    },
    ".cm-line": {
      width: "100%",
    },
    ".cm-focused": {
      outline: "none",
    },
    ".cm-scoller": {
      width: "100%",
    },
    ".cm-cursor": {
      borderLeftColor: "var(--color-text-primary)",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "var(--color-text-selection)",
    },
  },
  { dark: true }
);
