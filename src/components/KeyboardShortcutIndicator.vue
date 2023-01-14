<script lang="ts" setup>
const props = defineProps(["value"]);
</script>

<template>
  <span class="keyboard-shortcut-indicator">{{ props.value }}</span>
</template>

<style scoped>
.keyboard-shortcut-indicator {
  display: inline-grid;
  font-size: 0.875em;
  padding: 0px 4px;
  box-shadow: 0 0 0 1px rgb(175 200 255 / 20%);
  border-radius: 3px;
  position: relative;
  top: 1px;
}
</style>
