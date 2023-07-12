import "source-map-support/register";
import "./helpers/appState";
import { createAppState } from "./helpers/appState";
import path from "node:path";
import { BrowserWindow, app, ipcMain } from "electron/main";
import { OPEN_LINK_CHANNEL } from "./helpers/channels";
import { shell } from "electron";

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
        preload: path.join(app.getAppPath(), "dist/preload.js"),
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

    browserWindow.loadFile("./index.html");
    if (process.env.NODE_ENV !== "production") {
      browserWindow.webContents.openDevTools({
        mode: "undocked",
        activate: false,
      });
    }
  })
  .catch(console.error);
