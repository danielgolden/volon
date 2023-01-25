<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Icon from "./Icon.vue";

const emit = defineEmits(["update:model-value"]);
const props = defineProps(["modelValue"]);
const selectElement = ref<HTMLSelectElement | null>(null);

onMounted(() => {
  // Set inital value equal to v-model value
  if (selectElement !== null && selectElement.value!.options) {
    // @ts-expect-error
    [...selectElement.value.options!].find((option) => {
      return option.value === props.modelValue;
    }).selected = true;
  }
});
</script>

<template>
  <div class="select-container">
    <select
      class="select"
      v-bind="$attrs"
      :modelValue="props.modelValue"
      @change="emit('update:model-value', $event.target!.value)"
      ref="selectElement"
    >
      <slot></slot>
    </select>

    <Icon name="caret-down" class="select-caret" />
  </div>
</template>

<style scoped>
.select-container {
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--color-border-primary);
}

.select {
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  background-color: transparent;
  appearance: none;
  border: none;
  cursor: pointer;
}

:deep .select-caret {
  top: 14px;
  right: 12px;
  position: absolute;
}
</style>
