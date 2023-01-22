<script lang="ts" setup>
import { onMounted, ref, PropType } from "vue";

const props = defineProps({
  position: {
    type: String as PropType<"right" | "left" | "bottom" | "top">,
    required: false,
  },
  value: {
    type: String,
    required: true,
  },
});
const tooltipVisible = ref(false);
let displayTimer = ref(setTimeout(() => {}, 0));
const tooltipContainer = ref<HTMLElement | null>(null);
const tooltip = ref<HTMLElement | null>(null);

const positionTooltip = () => {
  const sourceElement = tooltipContainer.value!.children[1];
  const sourceElementPosition = sourceElement.getBoundingClientRect();
  const topValueForCenteringY =
    (sourceElementPosition.height - tooltip.value!.scrollHeight) / 2;
  const topValueForCenteringX =
    (sourceElementPosition.width - tooltip.value!.scrollWidth) / 2;
  // The side which the position of the tooltip should be based on
  // given the the value of the position prop.
  const sideReference = {
    right: "left",
    left: "left",
    top: "top",
    bottom: "top",
  };

  const sideReferenceValue: string = sideReference[props.position ?? "top"];

  switch (props.position) {
    case "right":
      // @ts-expect-error Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
      tooltip.value!.style[sideReferenceValue] =
        sourceElementPosition.right.toString() + "px";
      tooltip.value!.style.top =
        sourceElementPosition.top + topValueForCenteringY + "px";
      break;
    case "left":
      // @ts-expect-error Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
      tooltip.value!.style[sideReferenceValue] =
        (sourceElementPosition.left - tooltip.value!.scrollWidth).toString() +
        "px";
      tooltip.value!.style.top =
        sourceElementPosition.top + topValueForCenteringY + "px";
      break;
    case "top":
      // @ts-expect-error Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
      tooltip.value!.style[sideReferenceValue] =
        (sourceElementPosition.top - sourceElementPosition.height).toString() +
        "px";
      tooltip.value!.style.left =
        sourceElementPosition.left + topValueForCenteringX + "px";
      break;
    case "bottom":
      // @ts-expect-error Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
      tooltip.value!.style[sideReferenceValue] =
        sourceElementPosition.bottom.toString() + "px";
      tooltip.value!.style.left =
        sourceElementPosition.left + topValueForCenteringX + "px";
      break;
  }
};

onMounted(() => {
  const sourceElement = tooltipContainer.value!.children[1];
  const waitTime = 400;

  tooltipContainer.value?.addEventListener("mouseenter", () => {
    clearTimeout(displayTimer.value);
    displayTimer.value = setTimeout(() => {
      positionTooltip();
      tooltipVisible.value = true;
    }, waitTime);
  });

  tooltipContainer.value?.addEventListener("mouseleave", () => {
    clearTimeout(displayTimer.value);
    tooltipVisible.value = false;
  });

  sourceElement.addEventListener("click", () => {
    clearTimeout(displayTimer.value);
    tooltipVisible.value = false;
  });
});
</script>

<template>
  <div class="tooltip-container" ref="tooltipContainer">
    <span
      :class="`tooltip ${props.position ?? ''} ${
        tooltipVisible ? 'visible' : ''
      }`"
      ref="tooltip"
      >{{ props.value }}</span
    >
    <slot ref="slotElement"></slot>
  </div>
</template>

<style scoped>
.tooltip-container {
  display: contents;
}

.tooltip.visible {
  opacity: 1;
}
.tooltip {
  opacity: 0;
  pointer-events: none;

  display: flex;
  position: fixed;
  font-size: 14px;
  padding: 3px 8px 5px;
  border-radius: 6px;
  background-color: rgb(0 0 0 / 50%);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 10000;
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  white-space: nowrap;

  transition: opacity 100ms var(--ease-out-quad),
    translate 100ms var(--ease-out-quad);
}

.tooltip.right {
  margin-left: 10px;
}
.tooltip.visible.right {
  translate: 2px 0;
}
</style>
