import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import VueCodemirror from "vue-codemirror";
import { EditorView } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { editorTheme } from "./editorTheme";

const codeMirrorOptions = {
  extensions: [markdown(), editorTheme, EditorView.lineWrapping],
};

const app = createApp(App);
app.use(VueCodemirror, codeMirrorOptions);
app.mount("#app");
