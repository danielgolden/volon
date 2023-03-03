<script lang="ts" setup>
import { onMounted, PropType, ref } from "vue";

const props = defineProps({
  leftElement: {
    required: true,
    type: Element as PropType<HTMLElement | null>,
  },
});

const isBeingDragged = ref(false);
const leftElementMinWidth = props.leftElement?.style.minWidth;
const xPosition = ref(0);
const leftElementWidth = ref(0);

const handleResizerMouseDown = (e: MouseEvent) => {
  isBeingDragged.value = true;
  xPosition.value = e.clientX;
  leftElementWidth.value = parseInt(
    window.getComputedStyle(props.leftElement!).width
  );
};

const handleResizerMouseMove = (e: MouseEvent) => {
  const xPositionChange = e.clientX - xPosition.value;
  const newLeftElementWidth = leftElementWidth.value + xPositionChange;

  props.leftElement!.style.width = `${newLeftElementWidth}px`;
};

onMounted(() => {
  document.addEventListener("mousemove", (e) => {
    if (isBeingDragged.value) {
      handleResizerMouseMove(e);
    }

    document.addEventListener("mouseup", () => {
      isBeingDragged.value = false;
    });
  });
});
</script>

<template>
  <div class="resizer-container" @mousedown="handleResizerMouseDown">
    <div class="resizer"></div>
  </div>
</template>

<style scoped>
.resizer-container {
  display: flex;
  z-index: 1000;
  height: 100%;
  margin-left: -4px;
  cursor: col-resize;
}

.resizer-container:before,
.resizer-container:after {
  content: "";
  display: block;
  height: 100%;
  width: 3px;
  background-color: transparent;
}

.resizer {
  width: 1px;
  height: 100%;
  background-color: var(--color-border-primary);
}

.resizer-container:hover .resizer {
  width: 3px;
  margin-left: -1px;
  box-sizing: content-box;
}
</style>
