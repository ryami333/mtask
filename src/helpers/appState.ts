import { ipcMain } from "electron";
import {
  GET_STATE_CHANNEL,
  SET_STATE_CHANNEL,
  SHOW_TODO_CONTEXT_MENU,
  SYNC_STATE_CHANNEL,
} from "./channels";
import { readState } from "./readState";
import { writeState } from "./writeState";
import { BrowserWindow, Menu } from "electron/main";
import { z } from "zod";

export interface Todo {
  uuid: string;
  title: string;
  completed: boolean;
}

export interface ColorMapping {
  uuid: string;
  prefix: string;
  color: string;
}

export interface AppState {
  todos: Todo[];
  colors: ColorMapping[];
}

export const initialState: AppState = {
  todos: [],
  colors: [],
};

export const appStateSchema = z.object({
  todos: z
    .object({
      uuid: z.string().uuid(),
      title: z.string(),
      completed: z.boolean(),
    })
    .array(),
  colors: z
    .object({
      uuid: z.string().uuid(),
      prefix: z.string(),
      color: z.string(),
    })
    .array(),
}) satisfies z.ZodSchema<AppState>;

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

  ipcMain.handle(SHOW_TODO_CONTEXT_MENU, (_, uuid: string) => {
    const menu = Menu.buildFromTemplate([
      {
        type: "normal",
        label: "Delete",
        click: () => {
          appState.todos = appState.todos.filter((todo) => todo.uuid !== uuid);
        },
      },
    ]);
    menu.popup();
  });
};
