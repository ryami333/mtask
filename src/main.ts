import "source-map-support/register";
import path from "node:path";
import { BrowserWindow, Menu, app, ipcMain } from "electron/main";
import { shell } from "electron";
import { AppState } from "./helpers/appState";
import { readState, writeState } from "./helpers/store";
import {
  createEmitter,
  createEvents,
  createRoutes,
  payload,
  registerRoutes,
} from "./helpers/endpoints";

// These constants are injected by `@electron-forge/plugin-vite`.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

/**
 * Performance improvement:
 * https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
 */
// Menu.setApplicationMenu(null);

/**
 * Main -> renderer push events. The native "Delete" context menu lives in main,
 * so a click there is pushed back to the renderer to mutate the store.
 */
const events = createEvents([
  { event: "deleteTodo", payload: payload<string>() },
]);
export type AppEvents = typeof events;

const emit = createEmitter(events);

/** The window the emitter targets; set once the window is created. */
let mainWindow: BrowserWindow | undefined;

/**
 * The renderer -> main route table — the single source of truth for the
 * renderer's `client.invoke` surface. The renderer owns state; main is just the
 * disk service plus a few native affordances (menus, opening links).
 */
const endpoints = createRoutes([
  { operation: "getState", handler: (): AppState => readState() },
  {
    operation: "setState",
    handler: (state: AppState): void => writeState(state),
  },
  {
    operation: "openLink",
    handler: (url: string): void => {
      shell.openExternal(url);
    },
  },
  {
    operation: "showTodoContextMenu",
    handler: (uuid: string): void => {
      const menu = Menu.buildFromTemplate([
        {
          type: "normal",
          label: "Delete",
          click: () =>
            mainWindow && emit(mainWindow.webContents).deleteTodo(uuid),
        },
      ]);
      menu.popup();
    },
  },
]);
export type Endpoints = typeof endpoints;

app
  .whenReady()
  .then(async () => {
    mainWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      titleBarStyle: "customButtonsOnHover",
    });
    const browserWindow = mainWindow;

    /**
     * Register the route handlers before `loadFile` so the renderer's boot-time
     * `GET_STATE` always has a handler waiting.
     */
    registerRoutes(ipcMain, endpoints);

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
