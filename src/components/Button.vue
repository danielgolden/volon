<script lang="ts" setup>
import Icon from "./Icon.vue";
import { PropType, useSlots } from "vue";

const slots = useSlots();
const props = defineProps({
  type: {
    required: false,
    type: String as PropType<"primary" | "secondary" | "tertiary" | "danger">,
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
      'btn-danger': props.type === 'danger',
      'has-icon': props.icon,
      'icon-only': props.icon && !slots.default,
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
  gap: 6px;
  flex-shrink: 0;
  padding-inline: 8px;
  border-radius: 4px;
  font-family: var(--font-family-primary);
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 50ms var(--ease-out-quad);
  white-space: nowrap;
}

/*-- Primary buttons --*/
.btn-primary {
  padding: 7px 14px 10px;
  background-color: var(--color-bg-button-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-primary);
  color: var(--color-text-button-primary);
}

.btn-primary.has-icon:not(.icon-only) {
  padding: 7px 14px 10px 11px;
}

.btn-primary:hover {
  background-color: var(--color-bg-button-hover-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-primary),
    0 1px 3px rgb(0 0 0 / 3%), 0 3px 5px rgb(0 0 0 / 1.5%);
}

.btn-primary:active {
  translate: 0 1px;
}

/*-- Secondary buttons --*/
.btn-secondary {
  height: 31px;
  background-color: var(--color-bg-button);
  color: var(--color-text-primary);
  border: none;
}

.btn-secondary:hover,
.btn-active {
  background-color: var(--color-bg-button-hover);
  box-shadow: inset 0 0 0 1px var(--color-border-primary);
}

.btn-secondary:active {
  box-shadow: inset 0 0 0 1px var(--color-border-tertiary);
}

.btn-secondary-icon {
  pointer-events: none;
}

.btn-secondary-icon path {
  transition: all 50ms var(--ease-out-quad);
}

.btn-secondary:hover .btn-secondary-icon path,
.btn-active .btn-secondary-icon path {
  fill: var(--color-text-primary);
}

/*-- Tertiary button --*/

.btn-tertiary {
  background-color: transparent;
  color: var(--color-text-interactive);
  font-weight: 400;
  border: none;
}

.btn-tertiary:hover {
  background-color: transparent;
  color: #84bdff;
  border: none;
}

/*-- Danger button --*/

.btn-danger {
  padding: 7px 14px 10px;
  background-color: var(--color-bg-button-danger);
  box-shadow: inset 0 0 0 1px var(--color-border-button-danger);
  color: var(--color-text-button-danger);
}
.btn-danger:hover {
  background-color: var(--color-bg-button-hover-danger);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-danger);
  color: var(--color-text-button-danger);
}

.btn-danger :deep path {
  fill: var(--color-icon-danger);
}
</style>
