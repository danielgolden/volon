<script lang="ts" setup>
import Button from "./Button.vue";

const props = defineProps({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: false,
    type: String,
  },
  action: {
    required: false,
    type: Function,
  },
  actionLabel: {
    required: false,
    type: String,
  },
});
</script>

<template>
  <ol class="toast-container">
    <li class="toast" role="status">
      <span class="toast-title">{{ props.title }}</span>
      <p class="toast-description">{{ props.description }}</p>
      <Button class="toast-action" type="tertiary" @click="props.action"
        >Close</Button
      >
    </li>
  </ol>
</template>

<style scoped>
.toast-container {
  position: absolute;
  right: 0;
  height: 100%;
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
  position: absolute;
  right: 15px;
  bottom: 15px;
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
</style>
