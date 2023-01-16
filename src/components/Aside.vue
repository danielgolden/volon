<script lang="ts" setup>
import { signInWithGitHub, signout } from "../lib/supabase";
import { store } from "../store";
import { displayCommandPalette, downloadBackupOfData } from "../lib/utils";
</script>

<template>
  <Transition name="aside-toggle">
    <aside class="aside-container" v-if="store.loadedData.asideActive">
      <div style="position: absolute" v-if="false">
        <btn @click="signInWithGitHub">Sign in with GitHub</btn>
        <btn @click="signout">logOut</btn>
      </div>

      <a href="/" class="logo" title="Volón">
        <svg
          width="18"
          height="13"
          viewBox="0 0 18 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="logo-svg"
        >
          <path
            d="M14.256 0L11.25 5.4L8.676 10.242L6.12 5.4L3.114 0H0L7.128 12.6H10.242L17.37 0H14.256Z"
            fill="var(--color-text-primary)"
          />
        </svg>
      </a>

      <hr class="logo-separator" />

      <div class="menu-items">
        <ul class="primary-menu-items">
          <li class="primary-menu-item">
            <btn class="btn-menu btn-account">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="btn-menu-icon"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.49988 0.875C5.49784 0.875 3.87488 2.49797 3.87488 4.5C3.87488 6.15288 4.98112 7.54738 6.4936 7.98351C5.29958 8.12901 4.27545 8.55134 3.50395 9.31167C2.52203 10.2794 2.0249 11.72 2.0249 13.5999C2.0249 13.8623 2.23757 14.0749 2.4999 14.0749C2.76224 14.0749 2.9749 13.8623 2.9749 13.5999C2.9749 11.8799 3.42774 10.7206 4.17078 9.9883C4.91523 9.25463 6.02661 8.87499 7.49983 8.87499C8.97305 8.87499 10.0845 9.25463 10.8289 9.98831C11.572 10.7206 12.0249 11.8799 12.0248 13.5999C12.0248 13.8623 12.2375 14.0749 12.4998 14.0749C12.7622 14.075 12.9748 13.8623 12.9748 13.6C12.9749 11.72 12.4777 10.2794 11.4958 9.31166C10.7243 8.55135 9.70013 8.12903 8.50612 7.98352C10.0186 7.5474 11.1249 6.15289 11.1249 4.5C11.1249 2.49797 9.50191 0.875 7.49988 0.875ZM4.82488 4.5C4.82488 3.02264 6.02252 1.825 7.49988 1.825C8.97724 1.825 10.1749 3.02264 10.1749 4.5C10.1749 5.97736 8.97724 7.175 7.49988 7.175C6.02252 7.175 4.82488 5.97736 4.82488 4.5Z"
                  fill="var(--color-text-secondary)"
                />
              </svg>
            </btn>
          </li>
          <li class="primary-menu-item">
            <btn class="btn-menu btn-search" @click="displayCommandPalette">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="btn-menu-icon"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
                  fill="var(--color-text-secondary)"
                />
              </svg>
            </btn>
          </li>
        </ul>

        <btn class="btn-menu btn-backup" @click="downloadBackupOfData">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="btn-menu-icon"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.50005 1.05005C7.74858 1.05005 7.95005 1.25152 7.95005 1.50005V8.41365L10.1819 6.18185C10.3576 6.00611 10.6425 6.00611 10.8182 6.18185C10.994 6.35759 10.994 6.64251 10.8182 6.81825L7.81825 9.81825C7.64251 9.99398 7.35759 9.99398 7.18185 9.81825L4.18185 6.81825C4.00611 6.64251 4.00611 6.35759 4.18185 6.18185C4.35759 6.00611 4.64251 6.00611 4.81825 6.18185L7.05005 8.41365V1.50005C7.05005 1.25152 7.25152 1.05005 7.50005 1.05005ZM2.5 10.0001C2.77614 10.0001 3 10.2239 3 10.5001V12.0001C3 12.5539 3.44565 13.0001 3.99635 13.0001H11.0012C11.5529 13.0001 12 12.5528 12 12.0001V10.5001C12 10.2239 12.2239 10.0001 12.5 10.0001C12.7761 10.0001 13 10.2239 13 10.5001V12.0001C13 13.1041 12.1062 14.0001 11.0012 14.0001H3.99635C2.89019 14.0001 2 13.103 2 12.0001V10.5001C2 10.2239 2.22386 10.0001 2.5 10.0001Z"
              fill="var(--color-text-secondary)"
            />
          </svg>
        </btn>
      </div>

      <span v-if="false"
        >Logged in via {{ store.session.user.app_metadata.provider }}</span
      >
      <span v-if="false">Using localStorage data</span>
    </aside>
  </Transition>
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
  overflow: hidden;
  grid-template-rows: min-content 1fr;
  background-color: var(--color-bg-surface-2);
  border-right: 1px solid var(--color-border-secondary);
}
.aside-toggle-leave-active {
  transition: width 150ms var(--ease-in-out-quad);
}
.aside-toggle-enter-active {
  transition: width 200ms var(--ease-out-quad);
}

.aside-toggle-leave-to,
.aside-toggle-enter-from {
  width: 0;
}

.logo {
  display: flex;
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
  background-color: var(--color-bg-button);
  cursor: pointer;
  border-radius: 4px;
  transition: all 50ms var(--ease-out-quad);
}

.btn-menu:hover {
  background-color: var(--color-bg-button-hover);
  box-shadow: inset 0 0 0 1px var(--color-border-secondary);
}

.btn-menu:active {
  box-shadow: inset 0 0 0 1px var(--color-border-tertiary);
}

.btn-menu-icon path {
  transition: all 50ms var(--ease-out-quad);
}

.btn-menu:hover .btn-menu-icon path {
  fill: var(--color-text-primary);
}
</style>
