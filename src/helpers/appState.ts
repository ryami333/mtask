import { ipcMain } from "electron";
import {
  GET_STATE_CHANNEL,
  SET_STATE_CHANNEL,
  SYNC_STATE_CHANNEL,
} from "./channels";
import { readState } from "./readState";
import { writeState } from "./writeState";
import { BrowserWindow } from "electron/main";

export interface Todo {
  uuid: string;
  title: string;
  completed: boolean;
}

export interface AppState {
  todos: Todo[];
}

export const initialState: AppState = {
  todos: [],
};

export const createAppState = (browserWindow: BrowserWindow) => {
  const appState: AppState = new Proxy(readState(), {
    set(...args) {
      const result = Reflect.set(...args);

      // Sending "copy" because Proxy is not serializable.
      const copy = { ...appState };
      writeState(copy);

      browserWindow.webContents.send(SYNC_STATE_CHANNEL, copy);
      return result;
    },
  });

  ipcMain.handle(GET_STATE_CHANNEL, () => ({ ...appState }));
  ipcMain.handle(SET_STATE_CHANNEL, (_, patch: Partial<AppState>) => {
    Object.assign(appState, patch);
  });
};
