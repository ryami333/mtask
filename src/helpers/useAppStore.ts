import { create } from "zustand";
import { AppState, ColorMapping, Todo, initialState } from "./appState";
import { client } from "./trpc";

/**
 * The renderer owns application state. This store is the single source of
 * truth the UI reads from and writes to; persistence to disk is a side effect
 * wired up once via `initPersistence` (below), not something components think
 * about.
 */
interface AppStore extends AppState {
  addTodo: (todo: Todo) => void;
  toggleTodo: (uuid: string) => void;
  deleteTodo: (uuid: string) => void;
  clearCompleted: () => void;
  addColor: (color: ColorMapping) => void;
  removeColor: (uuid: string) => void;
  /** Replace the persisted slice with what was loaded from disk on boot. */
  hydrate: (state: AppState) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
  toggleTodo: (uuid) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.uuid === uuid ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),
  deleteTodo: (uuid) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.uuid !== uuid),
    })),
  clearCompleted: () =>
    set((state) => ({ todos: state.todos.filter((todo) => !todo.completed) })),
  addColor: (color) => set((state) => ({ colors: [...state.colors, color] })),
  removeColor: (uuid) =>
    set((state) => ({
      colors: state.colors.filter((color) => color.uuid !== uuid),
    })),
  hydrate: (state) => set(state),
}));

/**
 * Wire the store to the filesystem. Call once, after `hydrate`, so the initial
 * load doesn't echo straight back to disk:
 *
 *   - every store change is debounced and pushed to the main process, which
 *     validates with zod and writes `db.json` atomically (see `store.ts`);
 *   - the native "Delete" context menu lives in main, so it routes back here
 *     through `onDeleteTodo` and mutates the store like any other action.
 */
let writeTimer: ReturnType<typeof setTimeout> | undefined;

export const initPersistence = (): void => {
  useAppStore.subscribe((state) => {
    clearTimeout(writeTimer);
    writeTimer = setTimeout(() => {
      client.setState.mutate({
        todos: state.todos,
        colors: state.colors,
      });
    }, 150);
  });

  client.onDeleteTodo.subscribe(undefined, {
    onData: (uuid) => useAppStore.getState().deleteTodo(uuid),
  });
};
