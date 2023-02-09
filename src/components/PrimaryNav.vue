<script lang="ts" setup>
import { signout } from "../lib/supabase";
import { useSettingsStore } from "../stores/store.settings";
import { displayCommandPalette } from "../lib/utils";
import {
  intializeLocalStorageData,
  saveAppSettingsToLocalStorage,
} from "../lib/localStorage";
import { onMounted, ref } from "vue";
import { useGenericStateStore } from "../stores/store.genericState";
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import Tooltip from "./Tooltip.vue";

const accountMenuActive = ref(false);
const primaryNavElement = ref<HTMLElement | null>(null);
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

const handleLoginLinkClick = () => {
  genericState.settingsViewActive = true;
  accountMenuActive.value = false;
};

onMounted(() => {
  document.addEventListener("click", (e) => {
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
          <Tooltip value="Your data" position="right">
            <!-- the problem is the the ref isn't taking. See lines 40-47 -->
            <Button
              type="secondary"
              :class="{
                'btn-menu': true,
                'btn-account': true,
                'btn-active': accountMenuActive,
              }"
              @click="accountMenuActive = !accountMenuActive"
              icon="user"
            >
            </Button>
          </Tooltip>
        </li>
        <li class="primary-menu-item">
          <Tooltip value="Search notes (⌘K)" position="right">
            <Button
              type="secondary"
              icon="search"
              @click="displayCommandPalette"
            />
          </Tooltip>
        </li>
        <li class="primary-menu-item">
          <Tooltip
            :value="`${settings.asideActive ? 'Hide' : 'Show'} notes list (⌘/)`"
            position="right"
          >
            <Button
              type="secondary"
              @click="handleAsideButtonClick"
              icon="aside"
            />
          </Tooltip>
        </li>
      </ul>
      <Tooltip value="Settings" position="right">
        <Button
          type="secondary"
          icon="settings"
          @click="
            genericState.settingsViewActive = !genericState.settingsViewActive
          "
          title="Download a backup of your data"
        />
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
              class="popover-caret-fill"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.88867 1.49847L0 10.2049L8.88867 18.9114V17.2489L1.69725 10.2049L8.88867 3.16093V1.49847Z"
              fill="#2A303A"
              class="popover-caret-stroke"
            />
          </svg>

          <h3>
            <Icon name="lock" class="btn-menu-icon" color="currentColor" />
            Your notes are stored on this device
          </h3>
          <p>
            Your notes only stored locally and on this device. If you
            <a href="#" @click="handleLoginLinkClick">log in</a>,
            <em>your notes will be store in the cloud</em> and you will be able
            to use Volón across different browsers and devices.
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
              class="popover-caret-fill"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.88867 1.49847L0 10.2049L8.88867 18.9114V17.2489L1.69725 10.2049L8.88867 3.16093V1.49847Z"
              fill="#2A303A"
              class="popover-caret-stroke"
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
</style>
