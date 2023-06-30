import { z } from "zod";
import { safeJsonParse } from "./safeJsonParse";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { DB_PATH } from "./config";
import { AppState } from "./appState";

export const readState = (): AppState => {
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, "");
  }

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