<script lang="ts" setup>
import { Prop, PropType, ref } from "vue";
import Icon from "./Icon.vue";
import Button from "./Button.vue";

const props = defineProps({
  menuItems: {
    required: true,
    type: Array as PropType<MenuItem[]>,
  },
  buttonType: {
    required: false,
    type: String,
  },
  icon: {
    required: false,
    type: String as PropType<"primary" | "secondary" | "tertiary" | "danger">,
  },
});
const menuOpen = ref(false);
</script>

<template>
  <div class="menu-container" v-bind="$attrs">
    <Button
      :type="props.buttonType || 'primary'"
      :icon="props.icon"
      class="menu-trigger"
      @click="menuOpen = true"
    />

    <ul role="menu" class="menu-list" v-show="menuOpen">
      <li
        v-for="menuItem in props.menuItems"
        role="menuitem"
        :class="{
          'menu-item': menuItem.type !== 'separator',
          'menu-separator': menuItem.type === 'separator',
          destructive: menuItem.type === 'destructive',
        }"
        @click="menuItem.onClick"
      >
        <Icon :name="menuItem.icon" class="menu-item-icon" />
        <span v-if="menuItem.type !== 'separator'" class="menu-item-label">{{
          menuItem.label
        }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.menu-container {
  position: relative;
}
.menu-list {
  width: 180px;
  background-color: var(--color-bg-surface-1);
  padding: 4px;
  position: absolute;
  top: 35px;
  right: 0;
  list-style-type: none;
  border-radius: 6px;
  border: 1px solid var(--color-border-primary);
  box-shadow: 0px 4px 85px rgba(0, 0, 0, 0.5), 0px 4px 14px rgba(0, 0, 0, 0.2),
    0px 2px 3px rgba(0, 0, 0, 0.25);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px 9px;
  font-size: 14px;
  border-radius: 3px;
  color: var(--color-text-primary);
}

.menu-item.destructive:hover {
  color: var(--color-text-button-danger);
  background-color: var(--color-bg-button-danger);
}

:deep .menu-item.destructive:hover path {
  fill: var(--color-text-button-danger);
}

.menu-item:hover {
  background-color: var(--color-bg-indicator-high-contrast-inactive-hover);
}

:deep .menu-item-icon {
  position: relative;
  top: 1px;
}

.menu-separator {
  width: 100%;
  border-bottom: 1px dotted var(--color-border-primary);
  margin: 4px 0;
}
</style>
