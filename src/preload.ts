import { exposeElectronTRPC } from "electron-trpc-experimental/preload";

/**
 * Exposes the tRPC IPC bridge on `window` (via `contextBridge`) for the renderer
 * client to attach to. No hand-written API surface — the renderer derives its
 * fully-typed client from `AppRouter` instead.
 */
process.once("loaded", () => {
  exposeElectronTRPC();
});
