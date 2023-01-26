<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Icon from "./Icon.vue";

const emit = defineEmits(["update:model-value"]);
const props = defineProps(["modelValue", "label", "label-for", "description"]);
const selectElement = ref<HTMLSelectElement | null>(null);

onMounted(() => {
  // Set inital value equal to v-model value
  if (
    selectElement !== null &&
    selectElement.value!.options &&
    props.modelValue
  ) {
    // @ts-expect-error
    [...selectElement.value.options!].find((option) => {
      return option.value === props.modelValue;
    }).selected = true;
  }
});
</script>

<template>
  <div class="select-container">
    <div class="select-meta">
      <label class="select-label" v-if="props.label" :for="props['label-for']">
        {{ props.label }}
      </label>
      <p class="select-description" v-if="props.description">
        {{ props.description }}
      </p>
    </div>
    <div class="select-ui-container">
      <select
        class="select"
        v-bind="$attrs"
        :modelValue="props.modelValue"
        :id="props['label-for']"
        @change="
          emit(
            'update:model-value',
            ($event.target as HTMLSelectElement)!.value
          )
        "
        ref="selectElement"
      >
        <slot></slot>
      </select>

      <Icon name="caret-down" class="select-caret" />
    </div>
  </div>
</template>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.select-ui-container {
  position: relative;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px var(--color-border-button-primary);
  background-color: var(--color-bg-button-primary);
  overflow: hidden;
}

.select {
  padding: 6px 36px 10px 12px;
  font-size: 14px;
  font-family: var(--font-family-primary);
  font-weight: 500;
  background-color: transparent;
  color: var(--color-text-button-primary);
  appearance: none;
  border: none;
  cursor: pointer;
}

.select-ui-container:hover {
  background-color: var(--color-bg-button-hover-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-primary);
}

.select * {
  font-family: var(--font-family-primary);
}

:deep .select-caret {
  top: 10px;
  right: 10px;
  position: absolute;
}

.select-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.select-label {
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
}

.select-description {
  margin: 0 0 4px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
