import Store from "electron-store";
import { AppState, appStateSchema, initialState } from "./appState";

/**
 * `electron-store` owns persistence: it writes `<userData>/db.json` atomically
 * (temp file + rename, so a crash mid-write can't corrupt the DB) and provides
 * a `migrations` hook for evolving the on-disk shape across releases.
 *
 * For `mtask`, `userData` resolves to `<appData>/mtask`, and naming the store
 * `db` yields `<appData>/mtask/db.json` — the exact path the previous
 * hand-rolled layer used. Existing users' data is therefore picked up as-is.
 *
 * The store is created lazily because this module is imported at the top of
 * `main.ts`; deferring construction until first access keeps us from touching
 * `electron` app paths before the app is ready.
 */
let store: Store<AppState> | undefined;

const getStore = (): Store<AppState> =>
  (store ??= new Store<AppState>({ name: "db", defaults: initialState }));

/**
 * Deserialize. `electron-store` hands us a plain object parsed from JSON; we
 * run it through zod so the value the rest of the app sees is guaranteed to
 * match `AppState`. A missing/corrupt/outdated file falls back to the initial
 * state rather than throwing.
 */
export const readState = (): AppState =>
  appStateSchema.catch(initialState).parse(getStore().store);

/**
 * Serialize. Validate before persisting so a programming error can never write
 * a malformed state to disk.
 */
export const writeState = (state: AppState): void => {
  getStore().store = appStateSchema.parse(state);
};
