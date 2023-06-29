import { ipcMain } from "electron/main";
import {
  APP_STATE_CHANNEL,
  Action,
  AppState,
  initialState,
  reducer,
} from "./appStateCommon";
import { browserWindowRef } from "../browserWindow";

const appState: AppState = new Proxy(initialState, {
  set(...args) {
    const result = Reflect.set(...args);
    // TODO: promise-get browserWindow?
    console.log("state updated", JSON.stringify(appState));

    // Sending "copy" because Proxy is not serializable.
    const copy = { ...appState };
    browserWindowRef.current?.webContents.send(APP_STATE_CHANNEL, copy);
    return result;
  },
});

ipcMain.on(APP_STATE_CHANNEL, (_, action: Action) => {
  Object.assign(appState, reducer(appState, action));
});
