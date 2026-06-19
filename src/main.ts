import "source-map-support/register";
import "./helpers/appState";
import { createAppState } from "./helpers/appState";
import path from "node:path";
import { BrowserWindow, app, ipcMain } from "electron/main";
import { OPEN_LINK_CHANNEL } from "./helpers/channels";
import { shell } from "electron";

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
     * It's important to invoke `createAppState` before calling `loadFile` etc
     * to avoid race-conditions on listeners.
     */
    createAppState(browserWindow);

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
