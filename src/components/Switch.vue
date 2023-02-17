<script lang="ts" setup>
const emit = defineEmits(["update:model-value"]);
const props = defineProps(["modelValue", "label", "label-for"]);
</script>

<template>
  <label :for="props['label-for']" class="switch-container">
    <input
      v-bind="$attrs"
      :modelValue="props.modelValue"
      type="checkbox"
      role="switch"
      class="switch"
      :id="props['label-for']"
      @change="
        emit('update:model-value', ($event.target as HTMLSelectElement)!.value)
      "
      ref="switchElement"
    />
  </label>
</template>

<style scoped>
.switch-container {
  --thumb-size: 1.25rem;
  --thumb: var(--color-input-interactive);
  --thumb-highlight: hsla(0, 0%, 0%, 0.25);
  --track-size: calc(var(--thumb-size) * 2);
  --track-padding: 2px;
  --track-inactive: var(--color-bg-input-inactive);
  --track-active: var(--color-bg-input-success);
  --track-border: var(--color-bg-input-border-enabled);
  --thumb-color: var(--thumb);
  --thumb-color-highlight: var(--thumb-highlight);
  --track-color-inactive: var(--track-inactive);
  --track-color-active: var(--track-active);

  display: flex;
  justify-content: space-between;

  block-size: var(--thumb-size);
}

.switch {
  display: grid;
  box-sizing: content-box;
  appearance: none;
  background-color: var(--track-color-inactive);
  /* box-shadow: 0 0 0 1px var(--color-bg-input-border-enabled); */
  border-radius: var(--track-size);
  padding: var(--track-padding);
  inline-size: var(--track-size);
  block-size: var(--thumb-size);
  grid-template: [track] 1fr / [track] 1fr;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-x;
}

.switch:checked {
  background-color: var(--track-color-active);
  box-shadow: none;
}

.switch::before {
  content: "";
  border-radius: var(--track-size);
  display: block;
  grid-area: track;
  inline-size: var(--thumb-size);
  block-size: var(--thumb-size);
  background-color: var(--thumb-color);
  transition: all 0.2s var(--ease-in-out-cubic);
}

.switch:checked::before {
  transform: translateX(100%);
}
</style>
