<script lang="ts" setup>
import { onMounted, PropType, ref } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import { useUiStateStore } from "../stores/store.ui";

const props = defineProps({
  leftElement: {
    required: true,
    type: Element as PropType<HTMLElement | null>,
  },
  cssWidthVar: {
    required: false,
    type: String,
  },
});

const uiState = useUiStateStore();
const genericState = useGenericStateStore();
const isBeingDragged = ref(false);
const xPosition = ref(0);
const leftElementWidth = ref(0);

const handleResizerMouseDown = (e: MouseEvent) => {
  genericState.columnIsBeingResized = true;
  isBeingDragged.value = true;
  xPosition.value = e.clientX;
  leftElementWidth.value = parseInt(
    window.getComputedStyle(props.leftElement!).width
  );
};

const handleResizerMouseMove = (e: MouseEvent) => {
  const xPositionChange = e.clientX - xPosition.value;
  const newLeftElementWidth = leftElementWidth.value + xPositionChange;
  const elementHasMaxWidth =
    getComputedStyle(props.leftElement!).maxWidth !== "";
  const leftElementMaxWidth = elementHasMaxWidth
    ? parseInt(getComputedStyle(props.leftElement!)?.maxWidth)
    : null;
  const newWidthIsGreaterThanMaxWidth =
    elementHasMaxWidth && newLeftElementWidth > leftElementMaxWidth!;
  const handleCssVarUpdate = (newValue: number) => {
    if (props.cssWidthVar) {
      props.leftElement!.style.setProperty(
        `--${props.cssWidthVar}`,
        `${newValue}px`
      );
    }
  };
  const handleWidthPropertyUpdate = (newValue: number) => {
    if (!props.cssWidthVar) {
      props.leftElement!.style.width = `${newValue}px`;
    }
  };

  props.leftElement!.style.flexShrink = "0";

  if (newWidthIsGreaterThanMaxWidth) {
    handleCssVarUpdate(leftElementMaxWidth!);
    handleWidthPropertyUpdate(leftElementMaxWidth!);
    return;
  }

  handleCssVarUpdate(newLeftElementWidth!);
  handleWidthPropertyUpdate(newLeftElementWidth!);
};

onMounted(() => {
  setTimeout(() => {
    document.addEventListener("mousemove", (e) => {
      if (isBeingDragged.value) {
        handleResizerMouseMove(e);
      }

      document.addEventListener("mouseup", () => {
        isBeingDragged.value = false;
        genericState.columnIsBeingResized = false;
      });
    });
  }, 1000);
});
</script>

<template>
  <div
    :class="{ 'resizer-container': true, 'is-being-dragged': isBeingDragged }"
    @mousedown="handleResizerMouseDown"
  >
    <div class="resizer"></div>
  </div>
</template>

<style scoped>
.resizer-container {
  display: flex;
  z-index: 1000;
  height: 100%;
  position: relative;
  left: -4px;
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

.resizer-container:hover .resizer,
.is-being-dragged .resizer {
  width: 3px;
  margin-left: -1px;
  box-sizing: content-box;
}
</style>
