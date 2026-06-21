import "source-map-support/register";
import "./helpers/appState";
import { createAppState } from "./helpers/appState";
import path from "node:path";
import { BrowserWindow, Menu, app, ipcMain } from "electron/main";
import type { MenuItemConstructorOptions } from "electron";
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

/**
 * Both windows share the same renderer bundle. The `hash` selects which page
 * the renderer mounts (see `renderer.tsx`).
 */
const loadRenderer = (browserWindow: BrowserWindow, hash?: string) => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    browserWindow.loadURL(
      hash
        ? `${MAIN_WINDOW_VITE_DEV_SERVER_URL}#${hash}`
        : MAIN_WINDOW_VITE_DEV_SERVER_URL,
    );
  } else {
    browserWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      hash ? { hash } : undefined,
    );
  }
};

const createMainWindow = () => {
  const browserWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "customButtonsOnHover",
  });

  loadRenderer(browserWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    browserWindow.webContents.openDevTools({
      mode: "undocked",
      activate: false,
    });
  }

  return browserWindow;
};

let settingsWindow: BrowserWindow | null = null;

const openSettingsWindow = () => {
  // Focus the existing window instead of spawning a duplicate.
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 480,
    height: 600,
    title: "Settings",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  loadRenderer(settingsWindow, "settings");

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
};

const isMac = process.platform === "darwin";

/**
 * Builds the application menu, adding a "Preferences" item (⌘,) that opens the
 * settings window. The remaining menus are the standard Electron roles so the
 * usual shortcuts (copy/paste, quit, window controls) keep working.
 */
const createApplicationMenu = () => {
  const preferencesItem: MenuItemConstructorOptions = {
    label: "Preferences…",
    accelerator: "CmdOrCtrl+,",
    click: () => openSettingsWindow(),
  };

  const template: MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              preferencesItem,
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          } satisfies MenuItemConstructorOptions,
        ]
      : []),
    ...(isMac
      ? []
      : [
          {
            label: "File",
            submenu: [preferencesItem, { type: "separator" }, { role: "quit" }],
          } satisfies MenuItemConstructorOptions,
        ]),
    { role: "editMenu" },
    { role: "viewMenu" },
    { role: "windowMenu" },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app
  .whenReady()
  .then(async () => {
    /**
     * It's important to invoke `createAppState` before loading any renderer
     * to avoid race-conditions on listeners.
     */
    createAppState();

    ipcMain.handle(OPEN_LINK_CHANNEL, (_, url: string) => {
      shell.openExternal(url);
    });

    createApplicationMenu();

    createMainWindow();
  })
  .catch(console.error);
