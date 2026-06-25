# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`mtask` is a desktop todo app built with Electron + React 19 + TypeScript, bundled by Electron Forge's Vite plugin. The package metadata and `README.md` are leftovers from the `electron-quick-start-typescript` template and do not describe the actual app — ignore them.

## Commands

- `yarn dev` / `yarn start` — run the app in development (Vite dev server + hot reload; main window opens DevTools undocked).
- `yarn lint` — ESLint over the whole repo.
- `yarn storybook` — component workbench at port 6006. Components have co-located `*.stories.tsx` files; this is the primary way to develop/preview UI in isolation.
- `yarn make` — produce a distributable zip (macOS/darwin only, per `forge.config.mjs`); rebuilds icons first.

There is no test runner configured and no `tsc` build step (`tsconfig.json` is `noEmit`; Vite does the bundling). Type errors surface in the editor/`tsc --noEmit`, not via a yarn script.

All code should be formatted with Prettier (`yarn prettier {file} --write`).

Package manager is **Yarn 4** (`packageManager: yarn@4.17.0`). Node `^24.15.0`.

## Architecture

### Three processes, one renderer bundle

Standard Electron split — **main** (`src/main.ts`), **preload** (`src/preload.ts`), **renderer** (`src/renderer.tsx`) — but note both app windows load the _same_ renderer bundle. The main process opens a window with a URL hash to pick which page mounts: no hash → `HomePage`, `#settings` → `SettingsPage` (see `loadRenderer` in `main.ts` and the hash check in `renderer.tsx`). The settings window is a singleton, opened via the app menu's "Preferences…" (⌘,).

### State lives in the main process and is broadcast to all windows

This is the core pattern to understand before touching state. There is a single source of truth — `AppState` (`todos` + `colors`) — owned by the **main** process, not React.

- `src/helpers/appState.ts` builds the canonical state as a **`Proxy`**. Any mutation through the proxy's `set` trap (a) validates + persists via `electron-store`, and (b) `webContents.send(SYNC_STATE_CHANNEL, copy)` to **every** open window. This is how the home and settings windows stay in sync. Because a `Proxy` isn't serializable, a plain `{ ...appState }` copy is always sent/returned.
- `createAppState()` must be called **before any renderer loads** (it registers the `ipcMain` handlers) — `main.ts` does this first inside `app.whenReady()`.
- `src/helpers/store.ts` wraps `electron-store`, persisting to `<userData>/mtask/db.json`. Every read is parsed through the zod schema with `.catch(initialState)`; every write is validated first, so a corrupt/outdated file degrades to defaults rather than throwing.
- `src/helpers/appState.ts` also defines the `AppState` TypeScript types **and** the `appStateSchema` zod schema side by side — keep them in sync when changing the shape (the schema `satisfies z.ZodSchema<AppState>`).

### Renderer reads/writes state via the IPC client

- `preload.ts` exposes `window.ipcClient` (typed `IpcClient`) over the context bridge; `src/helpers/ipcClient.ts` re-exports it as a typed import so the rest of the renderer never touches `window`.
- Read path: renderer calls `getState()` once for `initialState`, then subscribes via `onSyncState` to receive every broadcast. `AppStateContext.tsx` wires this into React — `useAppState()` is the hook components use.
- Write path: components call `ipcClient.setState(patch)`. `patch` may be a partial object or an **updater function** `(current) => Partial<AppState>`; the function form is resolved in the preload by fetching current state first, so writes that depend on existing state (toggling, mapping, filtering todos) are safe. See `HomePage.tsx` for the canonical CRUD examples.
- IPC channel name constants live in `src/helpers/channels.ts`. Beyond the state channels, the only extra one is `OPEN_LINK_CHANNEL`: opening an external link is delegated to the main process (`shell.openExternal`) — the renderer fires `ipcClient.openLink(url)` (see link handling in `TodoItem.tsx`/`TodoList.tsx`).

### UI conventions

- Components are in `src/components/`, each with a co-located `*.module.css` (CSS Modules, accessed via `classnames/bind` → `const cx = classNames.bind(styles)`) and usually a `*.stories.tsx`.
- Global CSS tokens (colors, spacing, reset) are in `src/css/` and imported once via `renderer.tsx` → `css/main.css`.
- Modal state is managed by two reusable hooks with extensive doc comments: `useCrudModalState` (single modal for new/edit, with a `key` to force remount and reset form state) and `useDeleteModalState` (confirm-delete). Both deliberately keep `selectedEntity` while `isOpen` is false so the modal can animate closed without its contents flashing empty. Re-read their JSDoc before changing modal behavior.
- React Compiler is enabled (`babel-plugin-react-compiler` via the Vite renderer config), so manual `useMemo`/`useCallback` are generally unnecessary. Forms use `react-hook-form` + `zod` resolvers; hotkeys/focus use `@mantine/hooks`.
