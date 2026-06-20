import "source-map-support/register";
import path from "node:path";
import { EventEmitter } from "node:events";
import { BrowserWindow, Menu, app } from "electron/main";
import { shell } from "electron";
import { initTRPC } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { createIPCHandler } from "electron-trpc-experimental/main";
import { z } from "zod";
import { appStateSchema } from "./helpers/appState";
import { readState, writeState } from "./helpers/store";

// These constants are injected by `@electron-forge/plugin-vite`.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

/**
 * Performance improvement:
 * https://www.electronjs.org/docs/latest/tutorial/performance#8-call-menusetapplicationmenunull-when-you-do-not-need-a-default-menu
 */
// Menu.setApplicationMenu(null);

const t = initTRPC.create({ isServer: true });

/**
 * Internal bus for main -> renderer pushes. The native "Delete" context menu
 * lives in main; a click emits here, and the `onDeleteTodo` subscription relays
 * it to every connected renderer.
 */
const bus = new EventEmitter();

/**
 * The single source of truth for the renderer <-> main boundary. The renderer
 * owns state; main is just the disk service plus a few native affordances. Note
 * the `onDeleteTodo` payload type is inferred from `observable<string>` — there
 * is no second place to keep in sync.
 */
const router = t.router({
  getState: t.procedure.query(() => readState()),

  setState: t.procedure
    .input(appStateSchema)
    .mutation(({ input }) => writeState(input)),

  openLink: t.procedure.input(z.string()).mutation(({ input }) => {
    shell.openExternal(input);
  }),

  showTodoContextMenu: t.procedure.input(z.string()).mutation(({ input }) => {
    const menu = Menu.buildFromTemplate([
      {
        type: "normal",
        label: "Delete",
        click: () => bus.emit("deleteTodo", input),
      },
    ]);
    menu.popup();
  }),

  onDeleteTodo: t.procedure.subscription(() =>
    observable<string>((emit) => {
      const onDelete = (uuid: string) => emit.next(uuid);
      bus.on("deleteTodo", onDelete);
      return () => bus.off("deleteTodo", onDelete);
    }),
  ),
});

export type AppRouter = typeof router;

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
     * Attach the tRPC IPC handler before `loadFile` so the renderer's boot-time
     * `getState` query always has a handler waiting.
     */
    createIPCHandler({ router, windows: [browserWindow] });

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
