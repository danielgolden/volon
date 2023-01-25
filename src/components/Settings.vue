<script lang="ts" setup>
import Icon from "./Icon.vue";
import Button from "./Button.vue";
import Select from "./Select.vue";
import { signInWithGitHub } from "../lib/supabase";
</script>

<template>
  <article class="settings-container">
    <header class="settings-header">
      <a href="#" class="back-button">
        <Icon name="chevron-left" color="var(--color-accent)" />
        Notes
      </a>

      <h2 class="settings-heading">Settings</h2>
    </header>
    <div class="settings-primary-content">
      <div class="sync-notes-container">
        <h5 class="sync-notes-heading">
          Sync notes:
          <span class="sync-notes-status">
            Off
            <Icon name="minus-circled" color="currentColor"
          /></span>
        </h5>
        <p class="settings-section-description">
          <em>Log in to turn on notes sync</em>. Your notes will be stored in
          the cloud and you will be able to use Volón across different browsers
          and devices.
        </p>

        <div class="login-buttons">
          <Button :click="signInWithGitHub">
            <img src="../assets/logo-github.svg" class="btn-login-icon" />
            Log in with GitHub
          </Button>
        </div>
      </div>

      <hr />

      <Select label="Theme preferences" label-for="theme">
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </Select>

      <Select label="Sort notes by" label-for="notes-sorting">
        <option value="dateModified">Last modified</option>
        <option value="dateCreated">Date created</option>
      </Select>

      <div class="settings-section">
        <h6 class="settings-section-heading">Backup your data</h6>
        <p class="settings-section-description">
          Download a JSON file of your data.
        </p>
        <Button icon="download">Download a backup</Button>
      </div>

      <div class="settings-section">
        <h6 class="settings-section-heading">Delete your data</h6>
        <p class="settings-section-description">
          This action cannot be undone. Your notes will be permanently deleted.
        </p>
        <Button type="danger" icon="trash">Delete all notes</Button>
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
</template>

<style scoped>
.settings-container {
  width: 350px;
  border-right: 1px solid var(--color-border-primary);
  background-color: var(--color-bg-surface-2);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 349px;
  margin: 0;
  padding: 20px 24px;
  overflow-y: auto;
  position: relative;
  gap: 32px;
  color: var(--color-text-primary);
}

.settings-header {
  display: flex;
  flex-direction: column;
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
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

.settings-primary-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 2px;
}

.sync-notes-container {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sync-notes-heading {
  margin: 0;
  font-size: 14px;
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
  gap: 4px;
}

.settings-section-heading {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.settings-section .btn {
  margin-top: 4px;
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
