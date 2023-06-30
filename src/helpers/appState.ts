import { ipcMain } from "electron";
import { browserWindowRef } from "./browserWindow";
import {
  GET_STATE_CHANNEL,
  SET_STATE_CHANNEL,
  SYNC_STATE_CHANNEL,
} from "./channels";
import { readState } from "./readState";
import { writeState } from "./writeState";

export interface Todo {
  uuid: string;
  title: string;
}

export interface AppState {
  todos: Todo[];
}

export const initialState: AppState = {
  todos: [],
};

const appState: AppState = new Proxy(readState(), {
  set(...args) {
    const result = Reflect.set(...args);
    // TODO: promise-get browserWindow?
    console.log("state updated", JSON.stringify(appState));

    // Sending "copy" because Proxy is not serializable.
    const copy = { ...appState };
    writeState(copy);

    browserWindowRef.current?.webContents.send(SYNC_STATE_CHANNEL, copy);
    return result;
  },
});

ipcMain.handle(GET_STATE_CHANNEL, () => ({ ...appState }));
ipcMain.handle(SET_STATE_CHANNEL, (_, patch: Partial<AppState>) => {
  Object.assign(appState, patch);
});
