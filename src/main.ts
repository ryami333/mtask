import "source-map-support/register";
import path from "node:path";
import { BrowserWindow, Menu, app, ipcMain } from "electron/main";
import {
  DELETE_TODO_CHANNEL,
  GET_STATE_CHANNEL,
  OPEN_LINK_CHANNEL,
  SET_STATE_CHANNEL,
  SHOW_TODO_CONTEXT_MENU,
} from "./helpers/channels";
import { shell } from "electron";
import { AppState } from "./helpers/appState";
import { readState, writeState } from "./helpers/store";

// These constants are injected by `@electron-forge/plugin-vite`.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

/**
 * Performance improvement:
 * https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
 */
// Menu.setApplicationMenu(null);

app
  .whenReady()
  .then(async () => {
    const browserWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      titleBarStyle: "customButtonsOnHover",
    });

    /**
     * The renderer owns state; main is just the disk service. Register the
     * read/write handlers before `loadFile` so the renderer's boot-time
     * `getState` always has a handler waiting.
     */
    ipcMain.handle(GET_STATE_CHANNEL, () => readState());
    ipcMain.handle(SET_STATE_CHANNEL, (_, state: AppState) => writeState(state));

    ipcMain.handle(SHOW_TODO_CONTEXT_MENU, (_, uuid: string) => {
      const menu = Menu.buildFromTemplate([
        {
          type: "normal",
          label: "Delete",
          click: () => browserWindow.webContents.send(DELETE_TODO_CHANNEL, uuid),
        },
      ]);
      menu.popup();
    });

    ipcMain.handle(OPEN_LINK_CHANNEL, (_, url: string) => {
      shell.openExternal(url);
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      browserWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
      browserWindow.webContents.openDevTools({
        mode: "undocked",
        activate: false,
      });
    } else {
      browserWindow.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      );
    }
  })
  .catch(console.error);
