import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { z } from "zod";
import { resolve } from "path";
import { app } from "electron/main";
import { safeJsonParse } from "./safeJsonParse";

const APP_DATA_DIRECTORY = resolve(app.getPath("appData"), "mtask");
const DB_PATH = resolve(APP_DATA_DIRECTORY, "db.json");

export interface Todo {
  uuid: string;
  title: string;
}

export interface AppState {
  todos: Todo[];
}

if (!existsSync(APP_DATA_DIRECTORY)) {
  mkdirSync(APP_DATA_DIRECTORY, { recursive: true });
}

if (!existsSync(DB_PATH)) {
  writeFileSync(DB_PATH, "");
}

export const readState = (): AppState => {
  return z
    .object({
      todos: z
        .object({
          uuid: z.string().uuid(),
          title: z.string(),
        })
        .array(),
    })
    .catch({
      todos: [],
    })
    .parse(safeJsonParse(readFileSync(DB_PATH, "utf8")));
};

export const writeState = (state: AppState) =>
  writeFileSync(DB_PATH, JSON.stringify(state));

export const initialState: AppState = {
  todos: [],
};
