<script lang="ts" setup>
import { signout } from "../lib/supabase";
import { useSettingsStore } from "../stores/store.settings";
import { useElementRefsStore } from "../stores/store.elementRefs";
import { displayCommandPalette } from "../lib/utils";
import {
  intializeLocalStorageData,
  saveAppSettingsToLocalStorage,
} from "../lib/localStorage";
import { onMounted, ref } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import { useUiStateStore } from "../stores/store.ui";
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import Tooltip from "./Tooltip.vue";

const accountMenuActive = ref(false);
const primaryNavElement = ref<HTMLElement | null>(null);
const settings = useSettingsStore();
const genericState = useGenericStateStore();
const elementRefs = useElementRefsStore();
const uiState = useUiStateStore();

const handleLogOutClick = () => {
  signout();
  intializeLocalStorageData();
  genericState.clearActiveNoteState();
};

const handleAsideButtonClick = () => {
  settings.toggleAsideActive();
  saveAppSettingsToLocalStorage();
};

const handleLoginLinkClick = () => {
  uiState.settingsViewActive = true;
  accountMenuActive.value = false;
};

const createNewNote = () => {
  genericState.clearActiveNoteState();
  setTimeout(() => {
    elementRefs.codeMirror?.focus();
  }, 25);
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (accountMenuActive) {
      const accountButton =
        primaryNavElement.value!.querySelector(".btn-account");
      const didntClickAccountButton = e.target !== accountButton;
      const didntClickPopover = e.target !== primaryNavElement.value;
      const isntChildOfPopover = !(e.target as HTMLElement).closest(
        ".menu-popover"
      );

      if (
        didntClickAccountButton &&
        didntClickPopover &&
        isntChildOfPopover &&
        accountMenuActive.value
      ) {
        accountMenuActive.value = false;
      }
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && accountMenuActive) {
      accountMenuActive.value = false;
    }
  });
});
</script>

<template>
  <section class="primary-nav-container" ref="primaryNavElement">
    <a href="/" class="logo" title="Volón">
      <img src="../assets/logo-volon.svg" class="volon-logo" />
    </a>

    <hr class="logo-separator" />

    <div class="menu-items">
      <ul class="primary-menu-items">
        <li class="primary-menu-item">
          <Tooltip value="New note" position="right" shortcut="⌘⌥N">
            <Button type="secondary" icon="plus" @click="createNewNote" />
          </Tooltip>
        </li>
        <li class="primary-menu-item">
          <Tooltip value="Search notes" position="right" shortcut="⌘ shift F">
            <Button
              type="secondary"
              icon="search"
              @click="displayCommandPalette"
            />
          </Tooltip>
        </li>
        <li class="primary-menu-item markdown-preview-button">
          <Tooltip
            :value="
              settings.markdownPreviewActive
                ? `Hide markdown preview`
                : 'Show markdown preview'
            "
            position="right"
            shortcut="⌘ shift P"
          >
            <Button
              type="secondary"
              :icon="settings.markdownPreviewActive ? 'eye-open' : 'eye-closed'"
              @click="settings.toggleMarkdownPreviewActive"
            />
          </Tooltip>
        </li>
      </ul>
      <ul class="secondary-menu-items">
        <li class="primary-menu-item">
          <Tooltip
            :value="`${settings.asideActive ? 'Hide' : 'Show'} notes list`"
            position="right"
            shortcut="⌘/"
          >
            <Button
              type="secondary"
              @click="handleAsideButtonClick"
              icon="aside"
              class="aside-button"
            />
          </Tooltip>
        </li>
        <li class="primary-menu-item">
          <Tooltip value="Your data" position="right">
            <Button
              type="secondary"
              :class="{
                'btn-menu': true,
                'btn-account': true,
                'btn-active': accountMenuActive,
              }"
              @click="accountMenuActive = !accountMenuActive"
              icon="user"
            />
          </Tooltip>
        </li>

        <li>
          <Tooltip value="Settings" position="right">
            <Button
              type="secondary"
              icon="settings"
              @click="uiState.settingsViewActive = !uiState.settingsViewActive"
            />
          </Tooltip>
        </li>
      </ul>
    </div>
    <Transition name="popover-animation">
      <div
        class="menu-popover-container logged-out-menu-popover-container"
        v-if="accountMenuActive && !genericState.userIsLoggedIn"
      >
        <div class="menu-popover logged-out-menu-popover">
          <svg
            width="10"
            height="21"
            viewBox="0 0 10 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="popover-caret"
          >
            <path
              d="M9.29453e-08 10.2065L10 0.411465L10 20.0015L9.29453e-08 10.2065Z"
              fill="var(--color-bg-surface-2)"
              class="popover-caret-fill"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.88867 1.49847L0 10.2049L8.88867 18.9114V17.2489L1.69725 10.2049L8.88867 3.16093V1.49847Z"
              fill="var(--color-border-primary)"
              class="popover-caret-stroke"
            />
          </svg>

          <h3>
            <Icon name="lock" class="btn-menu-icon" color="currentColor" />
            Your notes are stored on your device
          </h3>

          <p>
            If you'd prefer to sync your notes across devices and browsers, you
            can <a href="#" @click="handleLoginLinkClick">log in</a>.
          </p>
        </div>
      </div>
    </Transition>
    <Transition name="popover-animation">
      <div
        class="menu-popover-container logged-in-menu-popover-container"
        v-if="accountMenuActive && genericState.userIsLoggedIn"
      >
        <div class="menu-popover logged-in-menu-popover">
          <svg
            width="10"
            height="21"
            viewBox="0 0 10 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="popover-caret"
          >
            <path
              d="M9.29453e-08 10.2065L10 0.411465L10 20.0015L9.29453e-08 10.2065Z"
              fill="var(--color-bg-surface-2)"
              class="popover-caret-fill"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.88867 1.49847L0 10.2049L8.88867 18.9114V17.2489L1.69725 10.2049L8.88867 3.16093V1.49847Z"
              fill="var(--color-border-primary)"
              class="popover-caret-stroke"
            />
          </svg>

          <span class="logged-in-meta"
            >Logged in with
            <strong>{{ genericState.formattedSessionProvider }}</strong></span
          >

          <hr />
          <div class="logged-out-buttons">
            <button class="btn-logout" @click="handleLogOutClick">
              <Icon name="exit" class="btn-icon" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.primary-nav-container {
  display: flex;
  flex-direction: column;
  grid-area: aside;
  width: 48px;
  height: 100%;
  flex-shrink: 0;
  padding: 8px;
  align-items: center;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-2);
  border-right: 1px solid var(--color-border-primary);
}
.logo {
  display: flex;
  align-items: flex-start;
  padding: 8px;
}

.logo-svg {
  width: 18px;
  height: 13px;
}
.logo-separator {
  width: 100%;
  height: 1px;
  padding: 0;
  margin-block: 8px;
  background-color: var(--color-border-primary);
  border: none;
}

.menu-items {
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.primary-menu-items,
.secondary-menu-items {
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  gap: 4px;
  list-style-type: none;
  margin: 4px;
  padding: 0;
}

.primary-menu-item {
  display: grid;
  place-items: center;
  width: 100%;
}

.menu-item-separator {
  height: 20px;
}

.menu-popover-container {
  position: absolute;
  z-index: 1000;
}

.menu-popover {
  position: relative;
  max-width: 370px;
  background-color: var(--color-bg-surface-2);
  border-radius: 6px;
  border: 1px solid var(--color-border-primary);
  box-shadow: 0px 14px 25px rgba(0, 0, 0, 0.1), 0px 4px 14px rgba(0, 0, 0, 0.1),
    0px 2px 3px rgba(0, 0, 0, 0.15);
}

.logged-out-menu-popover-container,
.logged-in-menu-popover-container {
  bottom: 43px;
  left: 64px;
}

.logged-out-menu-popover {
  padding: 22px 22px 24px;
}

.logged-in-menu-popover {
  width: 200px;
}

.popover-caret {
  position: absolute;
  left: -9px;
  bottom: 9px;
}

.logged-in-menu-popover .popover-caret {
  bottom: 9px;
}

.menu-popover h3 {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 16px;
  line-height: 16px;
  margin: 0 0 8px;
  font-weight: 400;
  color: var(--color-text-primary);
}

.menu-popover p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.menu-popover hr {
  margin: 21px 0 24px;
  border: none;
  border-top: 1px dotted var(--color-border-primary);
}

.logged-in-menu-popover hr {
  margin: 0;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.logged-in-meta {
  display: flex;
  width: 100%;
  text-align: center;
  gap: 4px;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  height: 35px;
  color: var(--color-text-secondary);
}

.logged-out-buttons {
  display: flex;
  justify-content: stretch;
  padding: 4px;
}

.btn-logout {
  display: flex;
  width: 100%;
  border-radius: 3px;
  align-items: center;
  justify-content: start;
  gap: 8px;
  padding: 8px 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.btn-login-icon {
  translate: 0 1px;
}

.btn-logout:hover {
  background-color: var(--color-bg-indicator-high-contrast-inactive-hover);
}

.popover-animation-enter-active {
  transition: all 150ms var(--ease-out-quad);
  transform-origin: top left;
}

.popover-animation-leave-active {
  transition: all 25ms var(--ease-in-out-quad);
}

.popover-animation-enter-from {
  opacity: 0;
  translate: -1px 0px;
  scale: 0.975;
}
.popover-animation-leave-to {
  opacity: 0;
}

main[data-theme="light"].aside-active .menu-popover {
  background-color: var(--color-bg-surface-1);
  border: none;
  box-shadow: 0px 8px 45px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.05),
    0px 2px 3px rgba(0, 0, 0, 0.075);
}
main[data-theme="light"]:not(.aside-active) .menu-popover {
  background-color: var(--color-bg-surface-2);
  box-shadow: none;
}
main[data-theme="light"] .popover-caret-stroke {
  fill: transparent;
}
main[data-theme="light"] .popover-caret-fill {
  fill: var(--color-bg-surface-1);
}
main[data-theme="light"]:not(.aside-active) .popover-caret-stroke {
  fill: var(--color-border-primary);
}
main[data-theme="light"]:not(.aside-active) .popover-caret-fill {
  fill: var(--color-bg-surface-2);
}

@media (prefers-color-scheme: light) {
  .btn-menu:hover,
  .btn-active {
    box-shadow: none;
  }

  .btn-menu:active {
    box-shadow: inset 0 0 0 1px var(--color-border-secondary);
  }

  .menu-popover {
    position: relative;
    max-width: 370px;
    background-color: var(--color-bg-surface-1);
    border-radius: 6px;
    border: none;
    box-shadow: 0px 14px 25px rgba(0, 0, 0, 0.1),
      0px 4px 14px rgba(0, 0, 0, 0.1), 0px 2px 3px rgba(0, 0, 0, 0.15);
  }

  .popover-caret-stroke,
  .popover-caret-fill {
    fill: #ffffff;
  }

  .btn-logout:hover {
    background-color: var(--color-bg-surface-2);
  }
}

@media (max-width: 800px) {
  .markdown-preview-button {
    display: none;
  }
  .aside-button {
    display: none;
  }
}
</style>
