import { contextBridge, ipcRenderer } from "electron";
import {
  GET_STATE_CHANNEL,
  OPEN_LINK_CHANNEL,
  SET_STATE_CHANNEL,
  SHOW_TODO_CONTEXT_MENU,
  SYNC_STATE_CHANNEL,
} from "./helpers/channels";
import type { AppState } from "./helpers/appState";

const onSyncState = (fn: (_: AppState) => void) =>
  ipcRenderer.on(SYNC_STATE_CHANNEL, (__, appState) => fn(appState));

const setState = async (
  patch: Partial<AppState> | ((current: AppState) => Partial<AppState>)
) => {
  if (typeof patch === "function") {
    // TODO: use schema
    const appState: AppState = await ipcRenderer.invoke(GET_STATE_CHANNEL);

    return void ipcRenderer.invoke(SET_STATE_CHANNEL, patch(appState));
  } else {
    return void ipcRenderer.invoke(SET_STATE_CHANNEL, patch);
  }
};

const appStateApi = {
  onSyncState,
  setState,
  getState: (): Promise<AppState> => ipcRenderer.invoke(GET_STATE_CHANNEL),
  showContextMenuForTodo: (uuid: string) => {
    ipcRenderer.invoke(SHOW_TODO_CONTEXT_MENU, uuid);
  },
  openLink: (url: string) => {
    ipcRenderer.invoke(OPEN_LINK_CHANNEL, url);
  },
};

export type AppStateApi = typeof appStateApi;

contextBridge.exposeInIsolatedWorld(0, "appState", appStateApi);

declare global {
  interface Window {
    appState: AppStateApi;
  }
}
