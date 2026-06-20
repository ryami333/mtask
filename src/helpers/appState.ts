import { z } from "zod";

const colorSchema = z.object({
  uuid: z.uuidv4(),
  prefix: z.string(),
  color: z.string(),
});

export type ColorMapping = z.output<typeof colorSchema>;

const todoSchema = z.object({
  uuid: z.uuidv4(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.output<typeof todoSchema>;

export const appStateSchema = z.object({
  todos: todoSchema.array(),
  colors: colorSchema.array(),
});

export type AppState = z.output<typeof appStateSchema>;

export const initialState: AppState = {
  todos: [],
  colors: [],
};
