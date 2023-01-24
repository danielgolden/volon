<script lang="ts" setup>
import Icon from "./Icon.vue";
import { PropType } from "vue";

const props = defineProps({
  type: {
    required: false,
    type: String as PropType<"primary" | "secondary" | "tertiary">,
  },
  icon: {
    required: false,
    type: String,
  },
});
</script>

<template>
  <button
    :class="{
      btn: true,
      'btn-primary': props.type === 'primary' || !props.type,
      'btn-secondary': props.type === 'secondary',
      'btn-tertiary': props.type === 'tertiary',
    }"
    v-bind="$attrs"
  >
    <Icon v-if="props.icon" :name="props.icon" />
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  font-family: var(--font-family-primary);
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 50ms var(--ease-out-quad);
}
.btn-primary {
  padding: 7px 0 10px;
  background-color: var(--color-bg-button-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-primary);
  color: var(--color-text-button-primary);
}

.btn-primary:hover {
  background-color: var(--color-bg-button-hover-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-primary);
}

.btn-primary:active {
  translate: 0 1px;
}

.btn-secondary {
  background-color: var(--color-bg-button);
}

.btn-primary:hover {
  background-color: var(--color-bg-button-hover-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-primary);
}

.btn-primary:active {
  translate: 0 1px;
}
</style>
