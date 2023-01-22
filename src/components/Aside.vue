<script lang="ts" setup>
import { signInWithGitHub, signout } from "../lib/supabase";
import { useSettingsStore } from "../stores/store.settings";
import { displayCommandPalette, downloadBackupOfData } from "../lib/utils";
import {
  intializeLocalStorageData,
  saveAppSettingsToLocalStorage,
} from "../lib/localStorage";
import { onMounted, ref } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import Icon from "./Icon.vue";
import Tooltip from "./Tooltip.vue";

const accountMenuActive = ref(false);
const asideElement = ref<HTMLElement | null>(null);
const accountButton = ref<HTMLElement | null>(null);
const settings = useSettingsStore();
const genericState = useGenericStateStore();

const handleLogOutClick = () => {
  signout();
  intializeLocalStorageData();
  genericState.clearActiveNoteState();
};

const handleAsideButtonClick = () => {
  settings.toggleAsideActive();
  saveAppSettingsToLocalStorage();
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    const didntClickAccountButton = e.target !== accountButton.value;
    const didntClickPopover = e.target !== asideElement.value;
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
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && accountMenuActive) {
      accountMenuActive.value = false;
    }
  });
});
</script>

<template>
  <section class="aside-container" ref="asideElement">
    <a href="/" class="logo" title="Volón">
      <img src="../assets/logo-volon.svg" class="volon-logo" />
    </a>

    <hr class="logo-separator" />

    <div class="menu-items">
      <ul class="primary-menu-items">
        <li class="primary-menu-item">
          <Tooltip value="Your data" position="right">
            <button
              :class="{
                'btn-menu': true,
                'btn-account': true,
                'btn-active': accountMenuActive,
              }"
              @click="accountMenuActive = !accountMenuActive"
              ref="accountButton"
            >
              <Icon name="user" class="btn-menu-icon" />
            </button>
          </Tooltip>
        </li>
        <li class="primary-menu-item">
          <Tooltip value="Search notes (⌘K)" position="right">
            <button class="btn-menu btn-search" @click="displayCommandPalette">
              <Icon name="search" class="btn-menu-icon" />
            </button>
          </Tooltip>
        </li>
        <li class="primary-menu-item">
          <Tooltip value="Notes list" position="right">
            <button
              class="btn-menu btn-toggle-note-list"
              @click="handleAsideButtonClick"
            >
              <Icon name="aside" class="btn-menu-icon" />
            </button>
          </Tooltip>
        </li>
      </ul>
      <Tooltip value="Download a backup" position="right">
        <button
          class="btn-menu btn-backup"
          @click="downloadBackupOfData"
          title="Download a backup of your data"
        >
          <Icon name="download" class="btn-menu-icon" />
        </button>
      </Tooltip>
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
              fill="#181B20"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.88867 1.49847L0 10.2049L8.88867 18.9114V17.2489L1.69725 10.2049L8.88867 3.16093V1.49847Z"
              fill="#2A303A"
            />
          </svg>

          <div class="login-buttons">
            <button class="btn-primary btn-login" @click="signInWithGitHub">
              <img src="../assets/logo-github.svg" class="btn-login-icon" />
              Log in with GitHub
            </button>
            <!-- <button class="btn-primary btn-login">
              <img src="../assets/logo-google.svg" class="btn-login-icon" />

              Log in with Google
            </button>
            <button class="btn-primary btn-login">
              <img src="../assets/logo-apple.svg" class="btn-login-icon" />

              Log in with Apple
            </button> -->
          </div>
          <hr />
          <h3>
            <Icon name="lock" class="btn-menu-icon" color="currentColor" />
            Your notes live on this device
          </h3>
          <p>
            Your notes are currently stored on this device. If you log in, your
            notes will be store in the cloud and you will be able to use Volón
            across different browsers and devices.
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
              fill="#181B20"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.88867 1.49847L0 10.2049L8.88867 18.9114V17.2489L1.69725 10.2049L8.88867 3.16093V1.49847Z"
              fill="#2A303A"
            />
          </svg>

          <span class="logged-in-meta"
            >Logged in with
            <strong>{{
              genericState.session.user.app_metadata.provider
            }}</strong></span
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
.aside-container {
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
  border-right: 1px solid var(--color-border-secondary);
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
  background-color: var(--color-border-secondary);
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

.primary-menu-items {
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

.btn-menu {
  display: grid;
  width: 100%;
  height: 31px;
  place-items: center;
  padding: 0;
  background-color: var(--color-bg-button);
  cursor: pointer;
  border-radius: 4px;
  border: none;
  transition: all 50ms var(--ease-out-quad);
}

.btn-menu:hover,
.btn-active {
  background-color: var(--color-bg-button-hover);
  box-shadow: inset 0 0 0 1px var(--color-border-secondary);
}

.btn-menu:active {
  box-shadow: inset 0 0 0 1px var(--color-border-tertiary);
}

.btn-menu-icon {
  pointer-events: none;
}

.btn-menu-icon path {
  transition: all 50ms var(--ease-out-quad);
}

.btn-menu:hover .btn-menu-icon path,
.btn-active .btn-menu-icon path {
  fill: var(--color-text-primary);
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
  border: 1px solid var(--color-border-secondary);
  box-shadow: 0px 14px 25px rgba(0, 0, 0, 0.1), 0px 4px 14px rgba(0, 0, 0, 0.1),
    0px 2px 3px rgba(0, 0, 0, 0.15);
}

.logged-out-menu-popover-container,
.logged-in-menu-popover-container {
  top: 51px;
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
  top: 13px;
}

.logged-in-menu-popover .popover-caret {
  top: 9px;
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
  border-top: 1px dotted var(--color-border-secondary);
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

.btn-primary {
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 7px 0 10px;
  gap: 10px;
  font-family: var(--font-family-primary);
  font-size: 14px;
  font-weight: 500;
  background-color: var(--color-bg-button-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-primary);
  color: var(--color-text-button-primary);
  cursor: pointer;
  transition: all 50ms var(--ease-out-quad);
}

.btn-primary:hover {
  background-color: var(--color-bg-button-hover-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-primary);
}

.btn-primary:active {
  translate: 0 1px;
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
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.btn-login-icon {
  translate: 0 1px;
}

.btn-logout:hover {
  background-color: var(--color-bg-surface-1);
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
</style>
