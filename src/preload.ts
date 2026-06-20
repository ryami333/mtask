import { contextBridge, ipcRenderer } from "electron";
import {
  DELETE_TODO_CHANNEL,
  GET_STATE_CHANNEL,
  OPEN_LINK_CHANNEL,
  SET_STATE_CHANNEL,
  SHOW_TODO_CONTEXT_MENU,
} from "./helpers/channels";
import type { AppState } from "./helpers/appState";

const appStateApi = {
  getState: (): Promise<AppState> => ipcRenderer.invoke(GET_STATE_CHANNEL),
  setState: (state: AppState): Promise<void> =>
    ipcRenderer.invoke(SET_STATE_CHANNEL, state),
  onDeleteTodo: (fn: (uuid: string) => void) =>
    ipcRenderer.on(DELETE_TODO_CHANNEL, (_, uuid: string) => fn(uuid)),
  showContextMenuForTodo: (uuid: string) => {
    ipcRenderer.invoke(SHOW_TODO_CONTEXT_MENU, uuid);
  },
  openLink: (url: string) => {
    ipcRenderer.invoke(OPEN_LINK_CHANNEL, url);
  },
};

export type AppStateApi = typeof appStateApi;

contextBridge.exposeInMainWorld("appState", appStateApi);

declare global {
  interface Window {
    appState: AppStateApi;
  }
}
