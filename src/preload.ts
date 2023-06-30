import { contextBridge, ipcRenderer } from "electron";
import { AppState, Todo, readState, writeState } from "./helpers/state";
import { browserWindowRef } from "./helpers/browserWindow";
import { APP_STATE_CHANNEL } from "./helpers/channels";

const appState: AppState = new Proxy(readState(), {
  set(...args) {
    const result = Reflect.set(...args);
    // TODO: promise-get browserWindow?
    console.log("state updated", JSON.stringify(appState));

    // Sending "copy" because Proxy is not serializable.
    const copy = { ...appState };
    writeState(copy);

    browserWindowRef.current?.webContents.send(APP_STATE_CHANNEL, copy);
    return result;
  },
});

const setState = (
  patch: Partial<AppState> | ((current: AppState) => AppState)
) => {
  if (typeof patch === "function") {
    Object.assign(appState, patch(appState));
  } else {
    Object.assign(appState, patch);
  }
};

const actions = {
  addTodo: (todo: Todo) =>
    setState((current) => ({ todos: [...current.todos, todo] })),
  removeTodo: (uuid: string) =>
    setState((current) => ({
      todos: current.todos.filter((todo) => todo.uuid !== uuid),
    })),
};

const onUpdate = (fn: (_: AppState) => void) =>
  ipcRenderer.on(APP_STATE_CHANNEL, (__, appState) => fn(appState));

const appStateApi = {
  actions,
  onUpdate,
  initialState: { ...appState },
};

export type AppStateApi = typeof appStateApi;

contextBridge.exposeInIsolatedWorld(0, "appState", appStateApi);

declare global {
  interface Window {
    appState: AppStateApi;
  }
}
