import { BrowserWindow, app } from "electron/main";
import path from "path";

export const browserWindowRef: {
  current: BrowserWindow | null;
} = { current: null };

export const createBrowserWindow = () => {
  const browserWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist/preload.js"),
    },
  });
  browserWindowRef.current = browserWindow;
  browserWindow.loadFile("./index.html");
  if (process.env.NODE_ENV !== "production") {
    browserWindow.webContents.openDevTools({
      mode: "undocked",
      activate: false,
    });
  }
};
