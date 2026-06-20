import Electron from "electron";
import { z } from "zod";

const CHANNEL = "cbb4a064-7140-4f51-b14e-474cc4594b4c"; // arbitrary random key

export type Route<T extends string, A, B> = {
  operation: T;
  handler: (args: A) => Promise<B>;
};

export function createRoutes<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly Route<string, any, any>[],
>(endpoints: T): T {
  return endpoints;
}

export function registerRoutes<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly Route<string, any, any>[],
>(ipcMain: Electron.IpcMain, endpoints: T) {
  ipcMain.on(CHANNEL, (_, _payload: unknown) => {
    const payload = z
      .object({
        operation: z.string(),
        params: z.unknown(),
      })
      .parse(_payload);
    const handler = endpoints.find(
      (endpoint) => endpoint.operation === payload.operation,
    )?.handler;
    if (!handler) {
      throw new Error(
        `Couldn't find handler for operation: ${JSON.stringify(payload.operation)}`,
      );
    }
    return handler(payload.params);
  });
}

export function createClient<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const T extends readonly Route<string, any, any>[],
>(ipcRenderer: Electron.IpcRenderer) {
  return function invoke(payload) {
    ipcRenderer.invoke(CHANNEL, payload);
  };
}
