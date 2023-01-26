<script lang="ts" setup>
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import Select from "./Select.vue";
import { signInWithGitHub } from "../lib/supabase";
import { useGenericStateStore } from "../stores/store.genericState";
const genericState = useGenericStateStore();
</script>

<template>
  <div class="settings-container">
    <article class="settings-content" v-if="genericState.settingsViewActive">
      <header class="settings-header">
        <h2 class="settings-heading">Settings</h2>
        <Button
          icon="cross-1"
          type="secondary"
          class="close-button"
          @click="genericState.settingsViewActive = false"
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
                  <span class="sync-notes-status">
                    Off
                    <Icon name="minus-circled" color="currentColor"
                  /></span>
                </h4>
                <p class="settings-row-description">
                  <em>Log in to turn on notes sync</em>. Your notes will be
                  stored in the cloud and you will be able to use Volón across
                  different browsers and devices.
                </p>
              </div>
              <div class="login-buttons">
                <Button :click="signInWithGitHub">
                  <img src="../assets/logo-github.svg" class="btn-login-icon" />
                  Log in with GitHub
                </Button>
              </div>
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
              <Select id="theme">
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
              <Select id="notes-sorting">
                <option value="dateModified">Last modified</option>
                <option value="dateCreated">Date created</option>
              </Select>
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
              <Button icon="download">Download a backup</Button>
            </div>
            <div class="settings-row">
              <div class="settings-row-copy">
                <h4 class="settings-row-heading">Delete your data</h4>
                <p class="settings-row-description">
                  This action cannot be undone. Your notes will be permanently
                  deleted.
                </p>
              </div>
              <Button type="danger" icon="trash">Delete all notes</Button>
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
  gap: 48px;
  max-width: 600px;
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
  display: inline-flex;
  align-items: center;
  font-weight: 400;
  gap: 5px;
  color: var(--color-text-secondary);
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
  width: 100%;
  margin-top: 4px;
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
  border: 1px solid var(--color-border-primary);
  border-radius: 4px;
}

.settings-row {
  display: flex;
  align-items: center;
  gap: 5%;
  padding: 20px;
  border-bottom: 1px dotted var(--color-border-primary);
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
  margin: 0;
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
