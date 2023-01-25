<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Icon from "./Icon.vue";

const emit = defineEmits(["update:model-value"]);
const props = defineProps(["modelValue", "label", "label-for"]);
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
    <label class="select-label" v-if="props.label" :for="props['label-for']">{{
      props.label
    }}</label>
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
  margin-block: 12px;
}
.select-ui-container {
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--color-border-primary);
}

.select {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  background-color: transparent;
  appearance: none;
  border: none;
  cursor: pointer;
}

:deep .select-caret {
  top: 10px;
  right: 12px;
  position: absolute;
}

.select-label {
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
}
</style>
