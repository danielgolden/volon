<script lang="ts" setup>
import Button from "./Button.vue";
import { useUiStateStore } from "../stores/store.ui";

const uiState = useUiStateStore();
</script>

<template>
  <TransitionGroup class="toast-container" tag="ol">
    <li
      v-for="toast in uiState.toasts"
      v-show="uiState.toastIsActive(toast.id)"
      class="toast"
      role="status"
      :key="toast.id"
    >
      <span class="toast-title">{{ toast.title }}</span>
      <p class="toast-description" v-if="toast.description">
        {{ toast.description }}
      </p>
      <Button
        class="toast-action"
        type="tertiary"
        @click="toast.action ? toast.action : uiState.removeToast(toast.id)"
        >Close</Button
      >
    </li>
  </TransitionGroup>
</template>

<style scoped>
.toast-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  right: 15px;
  bottom: 15px;
  min-width: 250px;
  margin: 0;
  list-style-type: none;
  padding: 0;
}

.toast {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: min(250px) 1fr;
  grid-template-areas:
    "title action"
    "description action";
  row-gap: 2px;
  padding: 12px 16px;
  z-index: 10;
  border-radius: 8px;
  background-color: var(--color-bg-floating);
  backdrop-filter: blur(5px);
}

.toast-title {
  margin: 0;
  grid-area: title;
  color: var(--color-text-inverted-primary);
  font-weight: 600;
}

.toast-description {
  margin: 0;
  grid-area: description;
  font-size: 14px;
  color: var(--color-text-inverted-secondary);
}

.toast-action {
  grid-area: action;
  color: var(--color-text-interactive-floating);
}

.toast-action:hover {
  color: var(--color-text-interactive-floating-hover);
}

.v-enter-active {
  transition: all 0.5s var(--ease-out-cubic);
}
.v-leave-active {
  transition: all 0.2s var(--ease-in-out-cubic);
}
.v-enter-from {
  translate: 10px 0;
  opacity: 0;
}
.v-leave-to {
  opacity: 0;
}
</style>
