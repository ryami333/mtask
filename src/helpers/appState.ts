import { ipcMain } from "electron";
import {
  GET_STATE_CHANNEL,
  SET_STATE_CHANNEL,
  SYNC_STATE_CHANNEL,
} from "./channels";
import { readState, writeState } from "./store";
import { BrowserWindow } from "electron/main";
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
  colors: [
    {
      uuid: crypto.randomUUID(),
      prefix: "AA",
      color: "#468C77",
    },
    {
      uuid: crypto.randomUUID(),
      prefix: "BB",
      color: "#4B698B",
    },
    {
      uuid: crypto.randomUUID(),
      prefix: "CC",
      color: "#D4AB6A",
    },
    {
      uuid: crypto.randomUUID(),
      prefix: "DD",
      color: "#AA6039",
    },
  ],
};

export const appStateSchema = z.object({
  todos: z
    .object({
      uuid: z.uuidv4(),
      title: z.string(),
      completed: z.boolean(),
    })
    .array(),
  colors: z
    .object({
      uuid: z.uuidv4(),
      prefix: z.string(),
      color: z.string(),
    })
    .array(),
}) satisfies z.ZodSchema<AppState>;

export const createAppState = () => {
  const appState: AppState = new Proxy(readState(), {
    set(...args) {
      const result = Reflect.set(...args);

      // Sending "copy" because Proxy is not serializable.
      const copy = { ...appState };
      writeState(copy);

      // Broadcast to every open window so the home and settings windows stay
      // in sync with each other.
      for (const window of BrowserWindow.getAllWindows()) {
        window.webContents.send(SYNC_STATE_CHANNEL, copy);
      }
      return result;
    },
  });

  ipcMain.handle(GET_STATE_CHANNEL, () => ({ ...appState }));
  ipcMain.handle(SET_STATE_CHANNEL, (_, patch: Partial<AppState>) => {
    Object.assign(appState, patch);
  });
};
