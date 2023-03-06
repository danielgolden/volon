<script lang="ts" setup>
import Icon from "./Icon.vue";
import { sendLocalNotesToDB, loadExistingDBData } from "../lib/supabase";
import Button from "./Button.vue";
import Select from "./Select.vue";
import Switch from "./Switch.vue";
import {
  signInWithGitHub,
  signInWithGoogle,
  signout,
  deleteAllUserNotes,
} from "../lib/supabase";
import { useGenericStateStore } from "../stores/store.genericState";
import { useSettingsStore } from "../stores/store.settings";
import { useUiStateStore } from "../stores/store.ui";
import { downloadBackupOfData } from "../lib/utils";
import {
  intializeLocalStorageData,
  saveAppSettingsToLocalStorage,
  deleteAllNotes,
  loadExistingLocalStorageData,
} from "../lib/localStorage";
const genericState = useGenericStateStore();
const settings = useSettingsStore();
const uiState = useUiStateStore();

const handleLogOutClick = () => {
  signout();
  intializeLocalStorageData();
  genericState.clearActiveNoteState();
};

const handleDeleteAllNotes = () => {
  const confirmDelete = confirm("Permanently delete all of your notes?");

  if (confirmDelete) {
    if (genericState.userIsLoggedIn) {
      deleteAllUserNotes();
    }

    deleteAllNotes();
    loadExistingLocalStorageData();
  }
};

const handleNotesSortingChange = () => {
  setTimeout(() => {
    saveAppSettingsToLocalStorage();
  }, 50);
};

const handleLocalNotesImportClick = async () => {
  await sendLocalNotesToDB();

  setTimeout(async () => {
    await loadExistingDBData();
  }, 100);
};
</script>

<template>
  <div class="settings-container">
    <article class="settings-content" v-if="uiState.settingsViewActive">
      <header class="settings-header">
        <h2 class="settings-heading">Settings</h2>
        <Button
          icon="cross-1"
          type="secondary"
          class="close-button"
          @click="uiState.settingsViewActive = false"
        />
      </header>
      <div class="settings-primary-content">
        <div class="settings-section">
          <h3 class="settings-section-heading">Sync your notes</h3>
          <div class="settings-box">
            <div class="settings-row">
              <div class="settings-row-copy">
                <h4 class="settings-row-heading">
                  Sync notes:
                  <span
                    :class="{
                      'sync-notes-status': true,
                      'logged-in': genericState.userIsLoggedIn,
                    }"
                  >
                    {{ genericState.userIsLoggedIn ? "On" : "Off" }}
                    <Icon
                      :name="
                        genericState.userIsLoggedIn ? 'check' : 'minus-circled'
                      "
                      :color="
                        genericState.userIsLoggedIn
                          ? 'var(--color-text-attention-success)'
                          : 'currentColor'
                      "
                  /></span>
                </h4>
                <p
                  class="settings-row-description"
                  v-if="!genericState.userIsLoggedIn"
                >
                  <em>Log in to turn on notes sync</em>. Your notes will be
                  stored in the cloud and you will be able to use Volón across
                  different browsers and devices.
                </p>
                <p class="settings-row-description" v-else>
                  You're notes are being synced (you are currently logged in
                  with
                  {{ genericState.session.user.app_metadata.provider }}).
                </p>
              </div>
              <div class="login-buttons" v-if="!genericState.userIsLoggedIn">
                <Button @click="signInWithGoogle">
                  <svg
                    width="15"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="btn-login-icon"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.3672 4.60455C9.5899 3.86136 8.60126 3.48295 7.50012 3.48295C5.54672 3.48295 3.89331 4.80227 3.30353 6.575C3.15353 7.025 3.06818 7.5057 3.06818 8.00002C3.06818 8.49434 3.15341 8.97502 3.30341 9.42502C3.89318 11.1977 5.54672 12.5171 7.50012 12.5171C8.50915 12.5171 9.3682 12.2512 10.0398 11.8013C10.8341 11.2695 11.3625 10.475 11.5364 9.53749H7.5V6.63635H14.5636C14.6523 7.12726 14.7 7.63862 14.7 8.17044C14.7 10.4545 13.8818 12.3772 12.4637 13.6829C11.2227 14.8284 9.52512 15.5 7.50012 15.5C4.56831 15.5 2.03194 13.8194 0.797852 11.3682C0.289897 10.3557 0 9.21025 0 8.00002C0 6.78979 0.289773 5.64434 0.797727 4.63184C2.03182 2.1807 4.56831 0.5 7.50012 0.5C9.52172 0.5 11.2194 1.24318 12.5183 2.45341L10.3672 4.60455Z"
                      fill="var(--color-text-button-primary)"
                    />
                  </svg>
                  Log in with Google
                </Button>
                <Button @click="signInWithGitHub">
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
                      fill="var(--color-text-button-primary)"
                    />
                  </svg>
                  Log in with GitHub
                </Button>
              </div>
              <Button @click="handleLogOutClick" icon="exit" v-else>
                Log out
              </Button>
            </div>
            <div class="settings-row" v-if="genericState.userIsLoggedIn">
              <div class="settings-row-copy">
                <h4 class="settings-row-heading">
                  Import locally stored notes
                </h4>
                <p class="settings-row-description">
                  Import any local notes that don't already exist in your
                  account.
                </p>
              </div>
              <Button @click="handleLocalNotesImportClick"
                >Import local notes</Button
              >
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-heading">Appearance</h3>
          <div class="settings-box">
            <div class="settings-row">
              <div class="settings-row-copy">
                <label class="settings-row-heading" for="theme">Theme</label>
                <p class="settings-row-description">
                  Choose how Volón looks to you. Select a single theme, or sync
                  with your system and automatically switch between dark and
                  light themes.
                </p>
              </div>
              <Select
                id="theme"
                v-model="settings.theme"
                @change="saveAppSettingsToLocalStorage"
              >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Select>
            </div>
            <div class="settings-row">
              <div class="settings-row-copy">
                <label class="settings-row-heading" for="notes-sorting"
                  >Sort notes by</label
                >
                <p class="settings-row-description">
                  Choose the default sorting order for your notes.
                </p>
              </div>
              <Select
                id="notes-sorting"
                v-model="settings.noteOrderPreference"
                @change="handleNotesSortingChange"
              >
                <option value="dateModified">Modification date</option>
                <option value="dateCreated">Date created</option>
              </Select>
            </div>

            <div class="settings-row">
              <div class="settings-row-copy">
                <label class="settings-row-heading" for="notes-sorting"
                  >Note list secondary text</label
                >
                <p class="settings-row-description">
                  Choose what data shows just below the note title in your note
                  list.
                </p>
              </div>
              <Select
                id="notes-sorting"
                v-model="settings.notePreviewContents"
                @change="saveAppSettingsToLocalStorage"
              >
                <option value="dateModified">Modification date</option>
                <option value="noteBody">Note contents</option>
              </Select>
            </div>
            <div class="settings-row">
              <div class="settings-row-copy">
                <label class="settings-row-heading" for="notes-sorting"
                  >Full width notes</label
                >
                <p class="settings-row-description">
                  Choose when your note text should take up the full width of
                  the window.
                </p>
              </div>
              <Select
                id="notes-sorting"
                v-model="settings.fullWidthNotes"
                @change="saveAppSettingsToLocalStorage"
              >
                <option value="never">Never</option>
                <option value="always">Always</option>
                <option value="whenPreviewActive">
                  When preview is active
                </option>
              </Select>
            </div>
            <div class="settings-row">
              <div class="settings-row-copy">
                <label class="settings-row-heading" for="syncScroll"
                  >Sync scroll</label
                >
                <p class="settings-row-description">
                  Choose what data shows just below the note title in your note
                  list.
                </p>
              </div>
              <Switch
                label-for="syncScroll"
                v-model="settings.syncScroll"
                @change="saveAppSettingsToLocalStorage"
              >
                <option value="dateModified">Modification date</option>
                <option value="noteBody">Note contents</option>
              </Switch>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-heading">Manage your data</h3>
          <div class="settings-box">
            <div class="settings-row">
              <div class="settings-row-copy">
                <h4 class="settings-row-heading">Backup your data</h4>
                <p class="settings-row-description">
                  Download a JSON file of your data.
                </p>
              </div>
              <Button icon="download" @click="downloadBackupOfData"
                >Download a backup</Button
              >
            </div>
            <div class="settings-row">
              <div class="settings-row-copy">
                <h4 class="settings-row-heading">Delete your data</h4>
                <p class="settings-row-description">
                  Your notes will be permanently deleted. This action cannot be
                  undone.
                </p>
              </div>
              <Button type="danger" icon="trash" @click="handleDeleteAllNotes"
                >Delete all notes</Button
              >
            </div>
          </div>
        </div>
      </div>
      <footer class="settings-footer">
        <p class="credits">
          Made in PA
          <a href="https://en.wikipedia.org/wiki/Pennsylvania"
            ><Icon name="pennsylvania" color="var(--color-accent)"
          /></a>
          by
          <a href="https://danielgolden.me/">Daniel Golden</a>
        </p>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.settings-container {
  width: 100%;
  border-right: 1px solid var(--color-border-primary);
  background-color: var(--color-bg-surface-1);
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  min-width: 349px;
  margin: 0;
  padding: 48px 24px 20px;
  overflow-y: auto;
  position: relative;
  gap: 32px;
  color: var(--color-text-primary);
}

.settings-content {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  height: 100%;
  gap: 48px;
}

.settings-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 2px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0px;
  text-decoration: none;
  padding: 4px;
  padding-left: 0;
  font-size: 14px;
  translate: -3px 0;
  color: var(--color-accent);
}

.settings-heading {
  font-size: 32px;
  font-weight: 600;
  margin: 0;
}

.settings-primary-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 16px;
}

.sync-notes-container {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sync-notes-heading {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.sync-notes-status {
  margin-left: 2px;
  display: inline-flex;
  align-items: center;
  font-weight: 400;
  gap: 4px;
  color: var(--color-text-secondary);
}

.sync-notes-status.logged-in {
  gap: 2px;
  color: var(--color-text-attention-success);
}

:deep .sync-notes-status svg {
  translate: 0 1px;
}

.settings-section-description {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-buttons {
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: stretch;
  margin-top: 4px;
}

.btn-login-icon {
  margin-right: 4px;
}

hr {
  width: 100%;
  border: none;
  border-bottom: 1px dotted var(--color-border-primary);
}

.settings-section {
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section-heading {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.settings-box {
  border: 1px solid var(--color-border-secondary);
  border-radius: 10px;
  background-color: var(--color-bg-surface-3);
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 5%;
  padding: 20px;
  border-bottom: 1px solid var(--color-border-secondary);
}

.settings-row:last-child {
  border-bottom: none;
}

.settings-row-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.settings-row-heading {
  font-size: 14px;
  line-height: 14px;
  font-weight: 600;
  margin: 0;
  grid-area: rowHeading;
  color: var(--color-text-primary);
}

.settings-row-description {
  font-size: 14px;
  margin: 0;
  grid-area: rowDescription;
  color: var(--color-text-secondary);
}

.credits {
  margin: 0 0 24px;
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.credits a {
  color: var(--color-accent);
  text-decoration: none;
}
.credits a:hover {
  text-decoration: underline;
}

:deep .credits .icon {
  translate: 0 2px;
}
</style>
