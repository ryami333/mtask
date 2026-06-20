import Electron from "electron";
import { z } from "zod";

/**
 * A typed RPC + pub/sub layer over a single pair of IPC channels.
 *
 * Instead of hand-rolling one `ipcMain.handle` / `ipcRenderer.invoke` pair per
 * operation (and a matching entry on the `window` bridge), every call travels
 * as a discriminated union `{ operation, params }` over one physical channel.
 * The route table declared in `main.ts` is the single source of truth: the
 * renderer's client type is *derived* from it, so the boundary can never drift.
 *
 *   - `invoke`    renderer -> main, request/response (backed by `ipcMain.handle`)
 *   - `subscribe` main -> renderer, fire-and-forget events (push)
 */

const INVOKE_CHANNEL = "cbb4a064-7140-4f51-b14e-474cc4594b4c"; // arbitrary random key
const EVENT_CHANNEL = "4c51019a-b020-4e29-b525-a177940a5707"; // arbitrary random key

// --- invoke (renderer -> main, request/response) ---------------------------

export type Route<T extends string, A, B> = {
  operation: T;
  handler: (args: A) => B;
};

/** Declare the invoke route table. Identity at runtime; preserves literal types. */
export function createRoutes<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly Route<string, any, any>[],
>(routes: T): T {
  return routes;
}

/**
 * Map a route table to the renderer-facing client surface, keyed by operation:
 * `{ setState: (args) => Promise<...>, GET_STATE: () => Promise<...> }`.
 * `invoke` always resolves a promise, so a sync handler return is awaited too.
 */
type InvokeMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly Route<string, any, any>[],
> = {
  [R in T[number] as R["operation"]]: (
    ...args: Parameters<R["handler"]>
  ) => Promise<Awaited<ReturnType<R["handler"]>>>;
};

export function registerRoutes<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly Route<string, any, any>[],
>(ipcMain: Electron.IpcMain, routes: T): void {
  ipcMain.handle(INVOKE_CHANNEL, (_event, raw: unknown) => {
    const { operation, params } = z
      .object({ operation: z.string(), params: z.unknown() })
      .parse(raw);
    const route = routes.find((r) => r.operation === operation);
    if (!route) {
      throw new Error(
        `No handler registered for operation: ${JSON.stringify(operation)}`,
      );
    }
    return route.handler(params);
  });
}

// --- subscribe (main -> renderer, push events) -----------------------------

/**
 * A push event declaration. `payload` is a phantom function: it never runs, it
 * only carries the payload type `P` so both ends stay in sync from one source.
 */
export type EventDef<T extends string, P> = {
  event: T;
  payload: (p: P) => void;
};

/** Phantom helper to attach a payload type to an event without a runtime value. */
export function payload<P>(): (p: P) => void {
  return () => {};
}

/** Declare the event table. Identity at runtime; preserves literal types. */
export function createEvents<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly EventDef<string, any>[],
>(events: T): T {
  return events;
}

type EventPayload<E> = E extends EventDef<string, infer P> ? P : never;

/** Renderer-facing: register a listener per event, returns an unsubscribe fn. */
type SubscribeMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly EventDef<string, any>[],
> = {
  [E in T[number] as E["event"]]: (
    listener: (payload: EventPayload<E>) => void,
  ) => () => void;
};

/** Main-facing: emit a typed payload to a specific renderer's `webContents`. */
type EmitMap<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends readonly EventDef<string, any>[],
> = {
  [E in T[number] as E["event"]]: (payload: EventPayload<E>) => void;
};

/**
 * Build a typed emitter bound to the event table. Call with a `webContents` to
 * target a window: `emit(win.webContents).deleteTodo(uuid)`. The `events`
 * argument is only used to infer `T` (the proxy needs no table at runtime).
 */
export function createEmitter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly EventDef<string, any>[],
>(events: T) {
  const known = new Set(events.map((e) => e.event));
  return function emit(webContents: Electron.WebContents): EmitMap<T> {
    return new Proxy({} as EmitMap<T>, {
      get:
        (_target, event: string) =>
        (data: unknown): void => {
          if (!known.has(event)) {
            throw new Error(
              `Emit of undeclared event: ${JSON.stringify(event)}`,
            );
          }
          webContents.send(EVENT_CHANNEL, { event, data });
        },
    });
  };
}

// --- client (renderer side) ------------------------------------------------

export type Client<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Routes extends readonly Route<string, any, any>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Events extends readonly EventDef<string, any>[],
> = {
  invoke: InvokeMap<Routes>;
  subscribe: SubscribeMap<Events>;
};

/**
 * Build the renderer client. Pass the `Routes`/`Events` *types* explicitly
 * (`createClient<Endpoints, AppEvents>(ipcRenderer)`) since they're shapes
 * exported from `main.ts`, not values available in the preload context.
 */
export function createClient<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Routes extends readonly Route<string, any, any>[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Events extends readonly EventDef<string, any>[] = [],
>(ipcRenderer: Electron.IpcRenderer): Client<Routes, Events> {
  const invoke = new Proxy({} as InvokeMap<Routes>, {
    get:
      (_target, operation: string) =>
      (params: unknown): Promise<unknown> =>
        ipcRenderer.invoke(INVOKE_CHANNEL, { operation, params }),
  });

  const subscribe = new Proxy({} as SubscribeMap<Events>, {
    get:
      (_target, event: string) =>
      (listener: (data: unknown) => void): (() => void) => {
        const handler = (_e: Electron.IpcRendererEvent, raw: unknown): void => {
          const { event: name, data } = raw as { event: string; data: unknown };
          if (name === event) listener(data);
        };
        ipcRenderer.on(EVENT_CHANNEL, handler);
        return () => ipcRenderer.removeListener(EVENT_CHANNEL, handler);
      },
  });

  return { invoke, subscribe };
}
