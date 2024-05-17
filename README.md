![readme HEader](https://user-images.githubusercontent.com/812989/215299854-049f8ae8-ca31-4468-a518-56679ea4a534.jpg)

# [Volon](https://volon.app)
Volon is a plain text, markdown-focused, local-first notes app with IDE like [text-editing keyboard shortcuts](#text-editing-shortcuts). It's meant the local storage of notes, but you can also log in to sync your notes across devices. Other helpful features:
- Multiple cursors, 
- GitHub style markdown link pasting 
- Command palette for finding notes (⌘K)

### Text editing shortcuts
- Move line up: `Alt + Up`
- Move line down: `Alt + Down`
- Copy line up: `Shift + Alt + Up`
- Copy line down: `Shift + Alt + Down`
- Insert blank line: `Cmd + Enter` (`Ctrl + Enter` on Windows)
- Select line: `Ctrl + l` (`Alt + l` on Windows)
- Indent less: `Cmd + [` (Ctrl + [ on Windows)
- Indent more: `Cmd + ]` (Ctrl + ] on Windows)
- Delete line: `Shift + Cmd + k` (`Shift + Ctrl + k` on Windows)
- Toggle comment: `Cmd + /` (`Ctrl + /` on Windows)
- Bold: `Cmd + b`
- Italicize: `Cmd + i`

### Screenshots
##### Minimal UI
<img width="1581" alt="Captura de Pantalla 2023-01-28 a la(s) 9 08 02 p m" src="https://user-images.githubusercontent.com/812989/215300470-43ddba87-0fa0-4d83-beaa-ffff8ac554f2.png">

##### Notes list and markdown preview enabled
<img width="1583" alt="Captura de Pantalla 2023-01-28 a la(s) 9 08 22 p m" src="https://user-images.githubusercontent.com/812989/215300483-404d5263-fd14-4b12-9b9f-bd0add897409.png">

---

## Supabase setup

Data can be synced remotely using [Supabase](https://supabase.com/). Create a new project then copy the project URL and anon key and set to the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` respectively.

Create a table `notes` with the following columns and enable RLS 

- `id: uuid: gen_random_uuid()`
- `created_at: datetimez: now()`
- `updated_at: datetimez: now()`
- `created_at: datetimez: now()`
- `content: text: NULL`
- `user_id: uuid: NULL`

### Setup table policies
- Enable insert for authenticated users only
- Enable read access for authenticated users
- Enable update access for authenticated users
- Enable delete access for authenticated users

Enable auth providers i.e. Google or GitHub

## Local dev (Vue 3 + TypeScript + Vite)]
(*Subtitute `pnpm` for your package manager of choice*)
```bash
pnpm install
pnpm run dev
```
### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
