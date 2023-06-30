import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { APP_DATA_DIRECTORY, DB_PATH } from "./config";
import { AppState } from "./state";

export const writeState = (state: AppState) => {
  if (!existsSync(APP_DATA_DIRECTORY)) {
    mkdirSync(APP_DATA_DIRECTORY, { recursive: true });
  }

  writeFileSync(DB_PATH, JSON.stringify(state));
};
