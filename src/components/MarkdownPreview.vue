<script lang="ts" setup>
import { ref, onMounted } from "vue";
import DOMPurify from "dompurify";
import Button from "./Button.vue";
import Tooltip from "./Tooltip.vue";
import { marked } from "marked";
import { useGenericStateStore } from "../stores/store.genericState";
import { useUiStateStore } from "../stores/store.ui";
import { useSettingsStore } from "../stores/store.settings";
import { useElementRefsStore } from "../stores/store.elementRefs";

// Override the output of <li> checkboxes to add the classes I want
// TODO: Write tests for this
const renderer = {
  listitem(text: string, task: boolean, checked: boolean) {
    const escapedText = text
      .replace(/^<input disabled="" type="checkbox">/g, "")
      .replace(/^<input checked="" disabled="" type="checkbox">/g, "");
    const checkedAttribute = checked ? "checked" : "";
    const checkboxInput = task
      ? `<input type="checkbox" ${checkedAttribute} disabled="" class="task-list-item-checkbox">`
      : "";
    const className = task ? `class="task-list-item"` : "";

    return `
        <li ${className}>
          ${checkboxInput}
          ${escapedText}
        </li>`;
  },
};

const genericState = useGenericStateStore();
const uiState = useUiStateStore();
const settings = useSettingsStore();
const elementRefs = useElementRefsStore();
const markdownPreviewContainer = ref<HTMLDivElement | null>(null);
let scrollEndTimer = setTimeout(() => {}, 0);
marked.use({ renderer });

const syncScrollWithEditor = () => {
  const isAvailableForScrollSync =
    genericState.scrollSyncActiveSection === "both" ||
    genericState.scrollSyncActiveSection === "preview";

  if (
    settings.syncScroll &&
    settings.markdownPreviewActive &&
    isAvailableForScrollSync
  ) {
    clearTimeout(scrollEndTimer);
    genericState.scrollSyncActiveSection = "preview";
    const scrollPercentage =
      markdownPreviewContainer.value!.scrollTop /
      (markdownPreviewContainer.value!.scrollHeight - window.innerHeight);
    const newEditorScrollPosition =
      scrollPercentage *
      (elementRefs.codeMirror!.scrollDOM!.scrollHeight - window.innerHeight);

    elementRefs.codeMirror!.scrollDOM?.scrollTo(0, newEditorScrollPosition);

    scrollEndTimer = setTimeout(() => {
      genericState.scrollSyncActiveSection = "both";
    }, 200);
  }
};

onMounted(() => {
  elementRefs.markdownPreviewContainer = markdownPreviewContainer.value;
});
</script>

<template>
  <Tooltip
    :value="`${
      uiState.fullScreenPreviewActive ? 'Shrink' : 'Expand'
    } markdown preview`"
    position="left"
  >
    <Button
      :icon="
        uiState.fullScreenPreviewActive ? 'exit-fullscreen' : 'enter-fullscreen'
      "
      @click="
        uiState.fullScreenPreviewActive = !uiState.fullScreenPreviewActive
      "
      class="btn-fullscreen"
    />
  </Tooltip>
  <section
    :class="{
      'markdown-preview-container': true,
      'fullscreen-markdown-preview': uiState.fullScreenPreviewActive,
      'full-width-text': settings.fullWidthNotesResult,
    }"
    ref="markdownPreviewContainer"
    @scroll="syncScrollWithEditor"
  >
    <div
      class="markdown-preview"
      v-html="DOMPurify.sanitize(marked.parse(genericState.activeNoteContents))"
    ></div>
  </section>
</template>

<style>
.markdown-preview-container {
  display: flex;
  grid-area: markdown-preview;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: var(--color-bg-surface-1);
  color: var(--color-text-primary);
  container-type: inline-size;
}

.fullscreen-markdown-preview {
  border-left: none;
}

.markdown-preview {
  max-width: 70ch;
  width: 100%;
  height: min-content;
  padding: 48px 48px;
  font-size: 20px;
}

.full-width-text .markdown-preview {
  max-width: 100%;
}

.btn.btn-fullscreen {
  padding: 8px;
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1;
}

@media (max-width: 800px) {
  .markdown-preview-container,
  .btn.btn-fullscreen {
    display: none;
  }
}

/*-----------------------------------------------------*/
/*---- github.com/sindresorhus/github-markdown-css ----*/
/*-----------------------------------------------------*/

main[data-theme="dark"] .markdown-preview {
  color-scheme: dark;
  --color-prettylights-syntax-comment: #8b949e;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-variable: #ffa657;
  --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
  --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
  --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
  --color-prettylights-syntax-carriage-return-text: #f0f6fc;
  --color-prettylights-syntax-carriage-return-bg: #b62324;
  --color-prettylights-syntax-string-regexp: #7ee787;
  --color-prettylights-syntax-markup-list: #f2cc60;
  --color-prettylights-syntax-markup-heading: #1f6feb;
  --color-prettylights-syntax-markup-italic: #c9d1d9;
  --color-prettylights-syntax-markup-bold: #c9d1d9;
  --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
  --color-prettylights-syntax-markup-deleted-bg: #67060c;
  --color-prettylights-syntax-markup-inserted-text: #aff5b4;
  --color-prettylights-syntax-markup-inserted-bg: #033a16;
  --color-prettylights-syntax-markup-changed-text: #ffdfb6;
  --color-prettylights-syntax-markup-changed-bg: #5a1e02;
  --color-prettylights-syntax-markup-ignored-text: #c9d1d9;
  --color-prettylights-syntax-markup-ignored-bg: #1158c7;
  --color-prettylights-syntax-meta-diff-range: #d2a8ff;
  --color-prettylights-syntax-brackethighlighter-angle: #8b949e;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
  --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
  --color-fg-default: var(--color-text-primary);
  --color-fg-muted: var(--color-text-secondary);
  --color-fg-subtle: #484f58;
  --color-canvas-default: #0d1117;
  --color-canvas-subtle: #161b22;
  --color-border-default: var(--color-border-primary);
  --color-border-muted: var(--color-border-primary);
  --color-neutral-muted: var(--color-bg-code);
  --color-accent-fg: #58a6ff;
  --color-accent-emphasis: #1f6feb;
  --color-attention-subtle: rgba(187, 128, 9, 0.15);
  --color-danger-fg: #f85149;
}

main[data-theme="light"] .markdown-preview {
  color-scheme: light;
  --color-prettylights-syntax-comment: #6e7781;
  --color-prettylights-syntax-constant: #0550ae;
  --color-prettylights-syntax-entity: #8250df;
  --color-prettylights-syntax-storage-modifier-import: #24292f;
  --color-prettylights-syntax-entity-tag: #116329;
  --color-prettylights-syntax-keyword: #cf222e;
  --color-prettylights-syntax-string: #0a3069;
  --color-prettylights-syntax-variable: #953800;
  --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
  --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
  --color-prettylights-syntax-invalid-illegal-bg: #82071e;
  --color-prettylights-syntax-carriage-return-text: #f6f8fa;
  --color-prettylights-syntax-carriage-return-bg: #cf222e;
  --color-prettylights-syntax-string-regexp: #116329;
  --color-prettylights-syntax-markup-list: #3b2300;
  --color-prettylights-syntax-markup-heading: #0550ae;
  --color-prettylights-syntax-markup-italic: #24292f;
  --color-prettylights-syntax-markup-bold: #24292f;
  --color-prettylights-syntax-markup-deleted-text: #82071e;
  --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
  --color-prettylights-syntax-markup-inserted-text: #116329;
  --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
  --color-prettylights-syntax-markup-changed-text: #953800;
  --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
  --color-prettylights-syntax-markup-ignored-text: #eaeef2;
  --color-prettylights-syntax-markup-ignored-bg: #0550ae;
  --color-prettylights-syntax-meta-diff-range: #8250df;
  --color-prettylights-syntax-brackethighlighter-angle: #57606a;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;
  --color-prettylights-syntax-constant-other-reference-link: #0a3069;
  --color-fg-default: var(--color-text-primary);
  --color-fg-muted: var(--color-text-secondary);
  --color-fg-subtle: #484f58;
  --color-canvas-default: #ffffff;
  --color-canvas-subtle: #f6f8fa;
  --color-border-default: #d0d7de;
  --color-border-muted: var(--color-border-primary);
  --color-neutral-muted: rgba(175, 184, 193, 0.2);
  --color-accent-fg: #0969da;
  --color-accent-emphasis: #0969da;
  --color-attention-subtle: #fff8c5;
  --color-danger-fg: #cf222e;
}

.markdown-preview {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  color: var(--color-fg-default);
  font-family: var(--font-family-primary);
  font-size: 20px;
  line-height: 1.4875;
  word-wrap: break-word;
}

.markdown-preview .octicon {
  display: inline-block;
  fill: currentColor;
  vertical-align: text-bottom;
}

.markdown-preview h1:hover .anchor .octicon-link:before,
.markdown-preview h2:hover .anchor .octicon-link:before,
.markdown-preview h3:hover .anchor .octicon-link:before,
.markdown-preview h4:hover .anchor .octicon-link:before,
.markdown-preview h5:hover .anchor .octicon-link:before,
.markdown-preview h6:hover .anchor .octicon-link:before {
  width: 16px;
  height: 16px;
  content: " ";
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
  mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
}

.markdown-preview details,
.markdown-preview figcaption,
.markdown-preview figure {
  display: block;
}

.markdown-preview summary {
  display: list-item;
}

.markdown-preview [hidden] {
  display: none !important;
}

.markdown-preview a {
  background-color: transparent;
  color: var(--color-text-interactive);
  text-decoration: none;
}

.markdown-preview a:active,
.markdown-preview a:hover {
  outline-width: 0;
}

.markdown-preview abbr[title] {
  border-bottom: none;
  text-decoration: underline dotted;
}

.markdown-preview b,
.markdown-preview strong {
  font-weight: 600;
}

.markdown-preview dfn {
  font-style: italic;
}

.markdown-preview h1 {
  margin: 0.67em 0;
  font-weight: 600;
  padding-bottom: 0.3em;
  font-size: 2em;
  /* border-bottom: 1px solid var(--color-border-muted); */
}

.markdown-preview mark {
  background-color: var(--color-attention-subtle);
  color: var(--color-text-primary);
}

.markdown-preview small {
  font-size: 90%;
}

.markdown-preview sub,
.markdown-preview sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

.markdown-preview sub {
  bottom: -0.25em;
}

.markdown-preview sup {
  top: -0.5em;
}

.markdown-preview img {
  border-style: none;
  max-width: 100%;
  box-sizing: content-box;
  background-color: var(--color-canvas-default);
}

.markdown-preview code,
.markdown-preview kbd,
.markdown-preview pre,
.markdown-preview samp {
  font-family: monospace, monospace;
  font-size: 1em;
}

.markdown-preview figure {
  margin: 1em 40px;
}

.markdown-preview hr {
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  border-bottom: 1px solid var(--color-border-muted);
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: var(--color-border-default);
  border: 0;
}

.markdown-preview input {
  font: inherit;
  margin: 0;
  overflow: visible;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.markdown-preview [type="button"],
.markdown-preview [type="reset"],
.markdown-preview [type="submit"] {
  -webkit-appearance: button;
}

.markdown-preview [type="button"]::-moz-focus-inner,
.markdown-preview [type="reset"]::-moz-focus-inner,
.markdown-preview [type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

.markdown-preview [type="button"]:-moz-focusring,
.markdown-preview [type="reset"]:-moz-focusring,
.markdown-preview [type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

.markdown-preview [type="checkbox"],
.markdown-preview [type="radio"] {
  box-sizing: border-box;
  padding: 0;
}

.markdown-preview [type="number"]::-webkit-inner-spin-button,
.markdown-preview [type="number"]::-webkit-outer-spin-button {
  height: auto;
}

.markdown-preview [type="search"] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

.markdown-preview [type="search"]::-webkit-search-cancel-button,
.markdown-preview [type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

.markdown-preview ::-webkit-input-placeholder {
  color: inherit;
  opacity: 0.54;
}

.markdown-preview ::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

.markdown-preview a:hover {
  text-decoration: underline;
}

.markdown-preview hr::before {
  display: table;
  content: "";
}

.markdown-preview hr::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-preview table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

.markdown-preview td,
.markdown-preview th {
  padding: 0;
}

.markdown-preview details summary {
  cursor: pointer;
}

.markdown-preview details:not([open]) > *:not(summary) {
  display: none !important;
}

.markdown-preview kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
    Liberation Mono, monospace;
  line-height: 10px;
  color: var(--color-fg-default);
  vertical-align: middle;
  background-color: var(--color-canvas-subtle);
  border: solid 1px var(--color-neutral-muted);
  border-bottom-color: var(--color-neutral-muted);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 var(--color-neutral-muted);
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4,
.markdown-preview h5,
.markdown-preview h6 {
  margin-top: 24px;
  margin-bottom: 12px;
  font-weight: 600;
  line-height: 1.25;
  font-family: var(--font-family-secondary);
}

.markdown-preview h2 {
  font-weight: 600;
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid var(--color-border-muted);
}

.markdown-preview h3 {
  margin-top: 32px;
  font-weight: 600;
  font-size: 1.25em;
}

.markdown-preview h4 {
  margin-top: 32px;
  font-weight: 600;
  font-size: 1em;
}

.markdown-preview h5 {
  font-weight: 600;
  font-size: 0.875em;
}

.markdown-preview h6 {
  font-weight: 600;
  font-size: 0.85em;
  color: var(--color-fg-muted);
}

.markdown-preview p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-preview blockquote {
  margin: 0;
  padding: 0 1em;
  color: var(--color-fg-muted);
  border-left: 0.25em solid var(--color-border-default);
}

.markdown-preview ul,
.markdown-preview ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 2em;
}

.markdown-preview ol ol,
.markdown-preview ul ol {
  list-style-type: lower-roman;
}

.markdown-preview ul ul ol,
.markdown-preview ul ol ol,
.markdown-preview ol ul ol,
.markdown-preview ol ol ol {
  list-style-type: lower-alpha;
}

.markdown-preview dd {
  margin-left: 0;
}

.markdown-preview tt,
.markdown-preview code {
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
    Liberation Mono, monospace;
  font-size: 12px;
}

.markdown-preview pre {
  margin-top: 0;
  margin-bottom: 0;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
    Liberation Mono, monospace;
  font-size: 12px;
  word-wrap: normal;
}

.markdown-preview .octicon {
  display: inline-block;
  overflow: visible !important;
  vertical-align: text-bottom;
  fill: currentColor;
}

.markdown-preview ::placeholder {
  color: var(--color-fg-subtle);
  opacity: 1;
}

.markdown-preview input::-webkit-outer-spin-button,
.markdown-preview input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
}

.markdown-preview .pl-c {
  color: var(--color-prettylights-syntax-comment);
}

.markdown-preview .pl-c1,
.markdown-preview .pl-s .pl-v {
  color: var(--color-prettylights-syntax-constant);
}

.markdown-preview .pl-e,
.markdown-preview .pl-en {
  color: var(--color-prettylights-syntax-entity);
}

.markdown-preview .pl-smi,
.markdown-preview .pl-s .pl-s1 {
  color: var(--color-prettylights-syntax-storage-modifier-import);
}

.markdown-preview .pl-ent {
  color: var(--color-prettylights-syntax-entity-tag);
}

.markdown-preview .pl-k {
  color: var(--color-prettylights-syntax-keyword);
}

.markdown-preview .pl-s,
.markdown-preview .pl-pds,
.markdown-preview .pl-s .pl-pse .pl-s1,
.markdown-preview .pl-sr,
.markdown-preview .pl-sr .pl-cce,
.markdown-preview .pl-sr .pl-sre,
.markdown-preview .pl-sr .pl-sra {
  color: var(--color-prettylights-syntax-string);
}

.markdown-preview .pl-v,
.markdown-preview .pl-smw {
  color: var(--color-prettylights-syntax-variable);
}

.markdown-preview .pl-bu {
  color: var(--color-prettylights-syntax-brackethighlighter-unmatched);
}

.markdown-preview .pl-ii {
  color: var(--color-prettylights-syntax-invalid-illegal-text);
  background-color: var(--color-prettylights-syntax-invalid-illegal-bg);
}

.markdown-preview .pl-c2 {
  color: var(--color-prettylights-syntax-carriage-return-text);
  background-color: var(--color-prettylights-syntax-carriage-return-bg);
}

.markdown-preview .pl-sr .pl-cce {
  font-weight: bold;
  color: var(--color-prettylights-syntax-string-regexp);
}

.markdown-preview .pl-ml {
  color: var(--color-prettylights-syntax-markup-list);
}

.markdown-preview .pl-mh,
.markdown-preview .pl-mh .pl-en,
.markdown-preview .pl-ms {
  font-weight: bold;
  color: var(--color-prettylights-syntax-markup-heading);
}

.markdown-preview .pl-mi {
  font-style: italic;
  color: var(--color-prettylights-syntax-markup-italic);
}

.markdown-preview .pl-mb {
  font-weight: bold;
  color: var(--color-prettylights-syntax-markup-bold);
}

.markdown-preview .pl-md {
  color: var(--color-prettylights-syntax-markup-deleted-text);
  background-color: var(--color-prettylights-syntax-markup-deleted-bg);
}

.markdown-preview .pl-mi1 {
  color: var(--color-prettylights-syntax-markup-inserted-text);
  background-color: var(--color-prettylights-syntax-markup-inserted-bg);
}

.markdown-preview .pl-mc {
  color: var(--color-prettylights-syntax-markup-changed-text);
  background-color: var(--color-prettylights-syntax-markup-changed-bg);
}

.markdown-preview .pl-mi2 {
  color: var(--color-prettylights-syntax-markup-ignored-text);
  background-color: var(--color-prettylights-syntax-markup-ignored-bg);
}

.markdown-preview .pl-mdr {
  font-weight: bold;
  color: var(--color-prettylights-syntax-meta-diff-range);
}

.markdown-preview .pl-ba {
  color: var(--color-prettylights-syntax-brackethighlighter-angle);
}

.markdown-preview .pl-sg {
  color: var(--color-prettylights-syntax-sublimelinter-gutter-mark);
}

.markdown-preview .pl-corl {
  text-decoration: underline;
  color: var(--color-prettylights-syntax-constant-other-reference-link);
}

.markdown-preview [data-catalyst] {
  display: block;
}

.markdown-preview g-emoji {
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 1em;
  font-style: normal !important;
  font-weight: 400;
  line-height: 1;
  vertical-align: -0.075em;
}

.markdown-preview g-emoji img {
  width: 1em;
  height: 1em;
}

.markdown-preview::before {
  display: table;
  content: "";
}

.markdown-preview::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-preview > *:first-child {
  margin-top: 0 !important;
}

.markdown-preview > *:last-child {
  margin-bottom: 0 !important;
}

.markdown-preview a:not([href]) {
  color: inherit;
  text-decoration: none;
}

.markdown-preview .absent {
  color: var(--color-danger-fg);
}

.markdown-preview .anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
}

.markdown-preview .anchor:focus {
  outline: none;
}

.markdown-preview p,
.markdown-preview blockquote,
.markdown-preview ul,
.markdown-preview ol,
.markdown-preview dl,
.markdown-preview table,
.markdown-preview pre,
.markdown-preview details {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-preview blockquote > :first-child {
  margin-top: 0;
}

.markdown-preview blockquote > :last-child {
  margin-bottom: 0;
}

.markdown-preview sup > a::before {
  content: "[";
}

.markdown-preview sup > a::after {
  content: "]";
}

.markdown-preview h1 .octicon-link,
.markdown-preview h2 .octicon-link,
.markdown-preview h3 .octicon-link,
.markdown-preview h4 .octicon-link,
.markdown-preview h5 .octicon-link,
.markdown-preview h6 .octicon-link {
  color: var(--color-fg-default);
  vertical-align: middle;
  visibility: hidden;
}

.markdown-preview h1:hover .anchor,
.markdown-preview h2:hover .anchor,
.markdown-preview h3:hover .anchor,
.markdown-preview h4:hover .anchor,
.markdown-preview h5:hover .anchor,
.markdown-preview h6:hover .anchor {
  text-decoration: none;
}

.markdown-preview h1:hover .anchor .octicon-link,
.markdown-preview h2:hover .anchor .octicon-link,
.markdown-preview h3:hover .anchor .octicon-link,
.markdown-preview h4:hover .anchor .octicon-link,
.markdown-preview h5:hover .anchor .octicon-link,
.markdown-preview h6:hover .anchor .octicon-link {
  visibility: visible;
}

.markdown-preview h1 tt,
.markdown-preview h1 code,
.markdown-preview h2 tt,
.markdown-preview h2 code,
.markdown-preview h3 tt,
.markdown-preview h3 code,
.markdown-preview h4 tt,
.markdown-preview h4 code,
.markdown-preview h5 tt,
.markdown-preview h5 code,
.markdown-preview h6 tt,
.markdown-preview h6 code {
  padding: 0 0.2em;
  font-size: 0.85em;
}

.markdown-preview ul.no-list,
.markdown-preview ol.no-list {
  padding: 0;
  list-style-type: none;
}

.markdown-preview ol[type="1"] {
  list-style-type: decimal;
}

.markdown-preview ol[type="a"] {
  list-style-type: lower-alpha;
}

.markdown-preview ol[type="i"] {
  list-style-type: lower-roman;
}

.markdown-preview div > ol:not([type]) {
  list-style-type: decimal;
}

.markdown-preview ul ul,
.markdown-preview ul ol,
.markdown-preview ol ol,
.markdown-preview ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-preview li > p {
  margin-top: 16px;
}

.markdown-preview li + li {
  margin-top: 0.25em;
}

.markdown-preview dl {
  padding: 0;
}

.markdown-preview dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-preview dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

.markdown-preview table th {
  font-weight: 600;
}

.markdown-preview table th,
.markdown-preview table td {
  padding: 6px 13px;
  border: 1px solid var(--color-border-default);
}

.markdown-preview table tr {
  background-color: var(--color-canvas-default);
  border-top: 1px solid var(--color-border-muted);
}

.markdown-preview table tr:nth-child(2n) {
  background-color: var(--color-canvas-subtle);
}

.markdown-preview table img {
  background-color: transparent;
}

.markdown-preview img[align="right"] {
  padding-left: 20px;
}

.markdown-preview img[align="left"] {
  padding-right: 20px;
}

.markdown-preview .emoji {
  max-width: none;
  vertical-align: text-top;
  background-color: transparent;
}

.markdown-preview span.frame {
  display: block;
  overflow: hidden;
}

.markdown-preview span.frame > span {
  display: block;
  float: left;
  width: auto;
  padding: 7px;
  margin: 13px 0 0;
  overflow: hidden;
  border: 1px solid var(--color-border-default);
}

.markdown-preview span.frame span img {
  display: block;
  float: left;
}

.markdown-preview span.frame span span {
  display: block;
  padding: 5px 0 0;
  clear: both;
  color: var(--color-fg-default);
}

.markdown-preview span.align-center {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-preview span.align-center > span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: center;
}

.markdown-preview span.align-center span img {
  margin: 0 auto;
  text-align: center;
}

.markdown-preview span.align-right {
  display: block;
  overflow: hidden;
  clear: both;
}

.markdown-preview span.align-right > span {
  display: block;
  margin: 13px 0 0;
  overflow: hidden;
  text-align: right;
}

.markdown-preview span.align-right span img {
  margin: 0;
  text-align: right;
}

.markdown-preview span.float-left {
  display: block;
  float: left;
  margin-right: 13px;
  overflow: hidden;
}

.markdown-preview span.float-left span {
  margin: 13px 0 0;
}

.markdown-preview span.float-right {
  display: block;
  float: right;
  margin-left: 13px;
  overflow: hidden;
}

.markdown-preview span.float-right > span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: right;
}

.markdown-preview code,
.markdown-preview tt {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: var(--color-neutral-muted);
  border-radius: 6px;
}

.markdown-preview code br,
.markdown-preview tt br {
  display: none;
}

.markdown-preview del code {
  text-decoration: inherit;
}

.markdown-preview pre code {
  font-size: 100%;
}

.markdown-preview pre > code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-preview .highlight {
  margin-bottom: 16px;
}

.markdown-preview .highlight pre {
  margin-bottom: 0;
  word-break: normal;
}

.markdown-preview .highlight pre,
.markdown-preview pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--color-canvas-subtle);
  border-radius: 6px;
}

.markdown-preview pre code,
.markdown-preview pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-preview .csv-data td,
.markdown-preview .csv-data th {
  padding: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
}

.markdown-preview .csv-data .blob-num {
  padding: 10px 8px 9px;
  text-align: right;
  background: var(--color-canvas-default);
  border: 0;
}

.markdown-preview .csv-data tr {
  border-top: 0;
}

.markdown-preview .csv-data th {
  font-weight: 600;
  background: var(--color-canvas-subtle);
  border-top: 0;
}

.markdown-preview .footnotes {
  font-size: 12px;
  color: var(--color-fg-muted);
  border-top: 1px solid var(--color-border-default);
}

.markdown-preview .footnotes ol {
  padding-left: 16px;
}

.markdown-preview .footnotes li {
  position: relative;
}

.markdown-preview .footnotes li:target::before {
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -24px;
  pointer-events: none;
  content: "";
  border: 2px solid var(--color-accent-emphasis);
  border-radius: 6px;
}

.markdown-preview .footnotes li:target {
  color: var(--color-fg-default);
}

.markdown-preview .footnotes .data-footnote-backref g-emoji {
  font-family: monospace;
}

.markdown-preview .task-list-item {
  list-style-type: none;
  padding-left: 0.5em;
}

.markdown-preview .task-list-item label {
  font-weight: 400;
}

.markdown-preview .task-list-item.enabled label {
  cursor: pointer;
}

.markdown-preview .task-list-item + .task-list-item {
  margin-top: 3px;
}

.markdown-preview .task-list-item .handle {
  display: none;
}

.markdown-preview .task-list-item-checkbox {
  scale: 1.175;
  translate: -1px 1.22px;
  margin: 0 0.2em 0.25em -1.6em;
  vertical-align: middle;
}

.markdown-preview .contains-task-list:dir(rtl) .task-list-item-checkbox {
  margin: 0 -1.6em 0.25em 0.2em;
}

.markdown-preview ::-webkit-calendar-picker-indicator {
  filter: invert(50%);
}

@container (max-width: 800px) {
  .markdown-preview {
    font-size: 18px;
  }

  .markdown-preview code {
    font-size: 15px;
  }
}

@container (max-width: 550px) {
  .markdown-preview {
    padding: 36px;
  }
}

@container (max-width: 480px) {
  .markdown-preview {
    padding: 24px;
  }
}
</style>
