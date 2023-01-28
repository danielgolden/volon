<script lang="ts" setup>
import { onMounted, PropType, ref } from "vue";
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import { useGenericStateStore } from "../stores/store.genericState";

const props = defineProps({
  menuItems: {
    required: true,
    type: Array as PropType<MenuItem[]>,
  },
  buttonType: {
    required: false,
    type: String as PropType<"primary" | "secondary" | "tertiary" | "danger">,
  },
  icon: {
    required: false,
    type: String,
  },
  closeCriteria: {
    required: false,
    type: Boolean,
  },
});
const menuOpen = ref(false);
const genericState = useGenericStateStore();

onMounted(() => {
  document.addEventListener("click", (e) => {
    const didntClickChildOfMenu = !(e.target as HTMLElement).closest(
      ".menu-container"
    );

    if (didntClickChildOfMenu) {
      menuOpen.value = false;
    }
  });
});
</script>

<template>
  <div class="menu-container" v-bind="$attrs" ref="menuContainerElement">
    <Button
      :type="props.buttonType || 'primary'"
      :icon="props.icon"
      :class="{ 'menu-trigger': true, 'menu-trigger--menu-open': menuOpen }"
      @click="menuOpen = !menuOpen"
    />
    <Transition>
      <ul role="menu" class="menu-list" v-show="menuOpen && !closeCriteria">
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
          <Icon
            v-if="menuItem.icon"
            :name="menuItem.icon"
            class="menu-item-icon"
          />
          <span v-if="menuItem.type !== 'separator'" class="menu-item-label">{{
            menuItem.label
          }}</span>
        </li>
      </ul>
    </Transition>
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
  z-index: 1;
  top: 35px;
  right: 0;
  list-style-type: none;
  border-radius: 6px;
  border: 1px solid var(--color-border-primary);
  box-shadow: 0px 4px 85px rgba(0, 0, 0, 0.5), 0px 4px 14px rgba(0, 0, 0, 0.2),
    0px 2px 3px rgba(0, 0, 0, 0.25);
  transform-origin: top right;
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

:deep .menu-trigger--menu-open {
  box-shadow: inset 0 0 0 1px var(--color-border-secondary);
}

.v-enter-active {
  transition: all 200ms var(--ease-out-cubic);
}
.v-leave-active {
  transition: all 50ms var(--ease-in-out-cubic);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  translate: 4px -8px;
  scale: 0.95;
}
</style>
