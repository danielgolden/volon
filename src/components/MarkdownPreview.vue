<script lang="ts" setup>
import { store } from "../store";
import VueMarkdown from "vue-markdown-render";
</script>

<template>
  <div class="markdown-preview-container">
    <vue-markdown class="markdown-preview" :source="store.activeNoteContents" />
  </div>
</template>

<style scoped>
.markdown-preview-container {
  display: flex;
  justify-content: center;
  padding: 28px 48px;
  background-color: var(--color-bg-surface-1);
  border-left: 1px solid var(--color-border-secondary);
  color: var(--color-text-primary);
}

.markdown-preview {
  max-width: 60ch;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  line-height: 150%;
  font-size: 20px;
}

@media (max-width: 1400px) {
  .markdown-preview-container {
    padding-block: 34px;
  }
  .markdown-preview {
    font-size: 16px;
  }
}
</style>
