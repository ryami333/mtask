import { safeJsonParse } from "./safeJsonParse";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { DB_PATH } from "./config";
import { AppState, appStateSchema } from "./appState";

export const readState = (): AppState => {
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, "");
  }

  return appStateSchema
    .catch({
      todos: [],
      colors: [],
    })
    .parse(safeJsonParse(readFileSync(DB_PATH, "utf8")));
};
