<script lang="ts" setup>
import Button from "./Button.vue";
import Icon from "./Icon.vue";
import { useUiStateStore } from "../stores/store.ui";

const uiState = useUiStateStore();

const handleToastAction = (
  hasAction: boolean,
  action: () => void,
  toastId: string
) => {
  if (hasAction) {
    action();
    uiState.removeToast(toastId);
  } else {
    uiState.removeToast(toastId);
  }
};
</script>

<template>
  <TransitionGroup class="toast-container" tag="ol">
    <li
      v-for="toast in uiState.toasts"
      v-show="uiState.toastIsActive(toast.id)"
      :class="{ toast: true, 'has-no-description': !toast.description }"
      role="status"
      :key="toast.id"
    >
      <span class="toast-title">
        <Icon
          v-if="toast.icon"
          :name="toast.icon"
          class="toast-icon"
          :color="
            toast.iconColor
              ? toast.iconColor
              : 'var(--color-text-inverted-secondary)'
          "
        />
        {{ toast.title }}
      </span>
      <p class="toast-description" v-if="toast.description">
        {{ toast.description }}
      </p>
      <Button
        class="toast-action"
        type="tertiary"
        @click="handleToastAction(!!toast.action, toast.action, toast.id)"
      >
        {{ toast.actionLabel ? toast.actionLabel : "Close" }}
      </Button>
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

.has-no-description {
  grid-template-rows: 1fr;
  grid-template-areas: "title action";
}

.toast-title {
  margin: 0;
  grid-area: title;
  color: var(--color-text-inverted-primary);
  font-weight: 400;
  display: flex;
  gap: 8px;
  align-items: center;
}

.toast-icon {
  translate: 0 1px;
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
