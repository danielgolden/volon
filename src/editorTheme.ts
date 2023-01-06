import { EditorView } from "@codemirror/view";

export const editorTheme = EditorView.theme(
  {
    "&": {
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },
    ".cm-content": {
      fontSize: "16px",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      caretColor: "black",
      padding: "24px",
    },
    ".cm-editor": {
      height: "100%",
    },
  },
  { dark: true }
);
