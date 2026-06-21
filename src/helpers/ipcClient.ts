import { type IpcClient } from "../preload";

/**
 * `window.ipcClient` is created by `exposeInMainWorld` in `preload.ts`. This
 * module is provided as a convenience, and so that we don't have to ambiently
 * type the Window interface.
 */
// @ts-expect-error: ^
export const ipcClient: IpcClient = window.ipcClient;
