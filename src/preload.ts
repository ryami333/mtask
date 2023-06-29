import {
  APP_STATE_CHANNEL,
  Action,
  AppState,
} from "./helpers/appState/appStateCommon";
import { contextBridge, ipcRenderer } from "electron";

interface AppStateApi {
  dispatch(action: Action): void;
  onUpdate(fn: (appState: AppState) => void): void;
}

contextBridge.exposeInIsolatedWorld(0 /* TODO: is this right? */, "appState", {
  dispatch: (action: Action) => ipcRenderer.send(APP_STATE_CHANNEL, action),
  onUpdate: (fn) =>
    ipcRenderer.on(APP_STATE_CHANNEL, (_, appState) => fn(appState)),
} satisfies AppStateApi);

declare global {
  interface Window {
    appState: AppStateApi;
  }
}
