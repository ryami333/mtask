import { app } from "electron/main";
import { resolve } from "node:path";

export const APP_DATA_DIRECTORY = resolve(app.getPath("appData"), "mtask");

export const DB_PATH = resolve(APP_DATA_DIRECTORY, "db.json");

console.dir({ APP_DATA_DIRECTORY, DB_PATH });
