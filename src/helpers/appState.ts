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
