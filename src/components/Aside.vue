<script lang="ts" setup>
import { signInWithGitHub, signout } from "../lib/supabase";
import { store } from "../store";
import { displayCommandPalette, downloadBackupOfData } from "../lib/utils";
import { onMounted, ref } from "vue";
import { et } from "date-fns/locale";

const accountMenuActive = ref(false);
const asideElement = ref<HTMLElement | null>(null);
const accountButton = ref<HTMLElement | null>(null);

onMounted(() => {
  document.addEventListener("click", (e) => {
    const didntClickAccountButton = e.target !== accountButton.value;
    const didntClickPopover = e.target !== asideElement.value;

    if (
      didntClickAccountButton &&
      didntClickPopover &&
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
  <Transition name="aside-toggle">
    <aside
      class="aside-container"
      v-if="store.loadedData.asideActive"
      ref="asideElement"
    >
      <div style="position: absolute" v-if="false">
        <button @click="signInWithGitHub">Sign in with GitHub</button>
        <button @click="signout">logOut</button>
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
            <button
              :class="{
                'btn-menu': true,
                'btn-account': true,
                'btn-active': accountMenuActive,
              }"
              @click="accountMenuActive = !accountMenuActive"
              ref="accountButton"
              title="Your notes data"
            >
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
            </button>
          </li>
          <li class="primary-menu-item">
            <button
              class="btn-menu btn-search"
              @click="displayCommandPalette"
              title="Search your notes"
            >
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
            </button>
          </li>
        </ul>

        <button
          class="btn-menu btn-backup"
          @click="downloadBackupOfData"
          title="Download a backup of your data"
        >
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
        </button>
      </div>

      <div
        class="menu-popover-container logged-out-menu-popover-container"
        v-if="accountMenuActive"
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

          <h3>Notes stored this device</h3>
          <p>
            Your notes will <em>only</em> be stored on this device unless you
            log in. To use Volón across different browsers and devices, log in.
          </p>

          <hr />
          <div class="login-buttons">
            <button class="btn-login">
              <svg
                width="17"
                height="18"
                viewBox="0 0 17 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="btn-login-icon"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.49923 0.831697C3.8751 0.831697 0.125 4.5813 0.125 9.20697C0.125 12.9067 2.52447 16.046 5.85246 17.1539C6.27148 17.2306 6.42418 16.972 6.42418 16.7498C6.42418 16.5509 6.41698 16.0244 6.41287 15.3257C4.08333 15.8316 3.59181 14.2028 3.59181 14.2028C3.21084 13.2352 2.66175 12.9776 2.66175 12.9776C1.90134 12.4584 2.71933 12.4686 2.71933 12.4686C3.55994 12.5278 4.00209 13.3319 4.00209 13.3319C4.74913 14.6116 5.96249 14.2419 6.43961 14.0275C6.5157 13.4866 6.73215 13.1175 6.97122 12.9082C5.1116 12.6964 3.15634 11.9782 3.15634 8.76893C3.15634 7.85428 3.48282 7.10725 4.01855 6.52165C3.93217 6.30982 3.64477 5.4584 4.10081 4.3052C4.10081 4.3052 4.80363 4.08 6.40361 5.16328C7.07148 4.97768 7.78818 4.88514 8.50026 4.88154C9.21182 4.88514 9.92801 4.97768 10.5969 5.16328C12.1959 4.08 12.8977 4.3052 12.8977 4.3052C13.3547 5.4584 13.0673 6.30982 12.9815 6.52165C13.5182 7.10725 13.8421 7.85428 13.8421 8.76893C13.8421 11.9864 11.8838 12.6943 10.0185 12.9015C10.3188 13.1602 10.5866 13.6712 10.5866 14.4527C10.5866 15.572 10.5763 16.4753 10.5763 16.7498C10.5763 16.974 10.7275 17.2347 11.1522 17.1529C14.4776 16.0429 16.875 12.9062 16.875 9.20697C16.875 4.5813 13.1249 0.831697 8.49923 0.831697Z"
                  fill="white"
                />
              </svg>

              Log in with GitHub
            </button>
            <button class="btn-login">
              <svg
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="btn-login-icon"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.3672 4.60455C9.5899 3.86136 8.60126 3.48295 7.50012 3.48295C5.54672 3.48295 3.89331 4.80227 3.30353 6.575C3.15353 7.025 3.06818 7.5057 3.06818 8.00002C3.06818 8.49434 3.15341 8.97502 3.30341 9.42502C3.89318 11.1977 5.54672 12.5171 7.50012 12.5171C8.50915 12.5171 9.3682 12.2512 10.0398 11.8013C10.8341 11.2695 11.3625 10.475 11.5364 9.53749H7.5V6.63635H14.5636C14.6523 7.12726 14.7 7.63862 14.7 8.17044C14.7 10.4545 13.8818 12.3772 12.4637 13.6829C11.2227 14.8284 9.52512 15.5 7.50012 15.5C4.56831 15.5 2.03194 13.8194 0.797852 11.3682C0.289897 10.3557 0 9.21025 0 8.00002C0 6.78979 0.289773 5.64434 0.797727 4.63184C2.03182 2.1807 4.56831 0.5 7.50012 0.5C9.52172 0.5 11.2194 1.24318 12.5183 2.45341L10.3672 4.60455Z"
                  fill="white"
                />
              </svg>

              Log in with Google
            </button>
            <button class="btn-login">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="btn-login-icon"
              >
                <path
                  d="M13.0969 5.45525C13.0041 5.52725 11.3657 6.45046 11.3657 8.50325C11.3657 10.8777 13.4505 11.7177 13.5129 11.7385C13.5033 11.7897 13.1817 12.8889 12.4137 14.0089C11.7289 14.9945 11.0137 15.9785 9.92571 15.9785C8.83771 15.9785 8.5577 15.3465 7.3017 15.3465C6.0777 15.3465 5.64251 15.9993 4.64731 15.9993C3.6521 15.9993 2.9577 15.0873 2.1593 13.9673C1.2345 12.6521 0.487305 10.6089 0.487305 8.66965C0.487305 5.55925 2.5097 3.90965 4.5001 3.90965C5.5577 3.90965 6.4393 4.60405 7.1033 4.60405C7.7353 4.60405 8.72091 3.86805 9.9241 3.86805C10.3801 3.86805 12.0185 3.90965 13.0969 5.45525ZM9.3529 2.55125C9.8505 1.96085 10.2025 1.14165 10.2025 0.322455C10.2025 0.208855 10.1929 0.0936545 10.1721 0.000854492C9.3625 0.0312545 8.39931 0.540055 7.81851 1.21365C7.36251 1.73205 6.9369 2.55125 6.9369 3.38165C6.9369 3.50645 6.95771 3.63125 6.96731 3.67125C7.01851 3.68085 7.10171 3.69205 7.18491 3.69205C7.9113 3.69205 8.8249 3.20565 9.3529 2.55125Z"
                  fill="white"
                />
              </svg>

              Log in with Apple
            </button>
          </div>
        </div>
      </div>
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
  z-index: 10;
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

.logged-out-menu-popover-container {
  top: 51px;
  left: 64px;
}

.logged-out-menu-popover {
  padding: 22px 22px 24px;
}

.popover-caret {
  position: absolute;
  left: -9px;
  top: 13px;
}

.menu-popover h3 {
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

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-login {
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
  transition: translate 50ms var(--ease-out-quad);
}

.btn-login:hover {
  background-color: var(--color-bg-button-hover-primary);
  box-shadow: inset 0 0 0 1px var(--color-border-button-hover-primary);
}

.btn-login:active {
  translate: 0 1px;
}
</style>
