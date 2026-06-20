import { contextBridge, ipcRenderer } from "electron";
import { createClient } from "./helpers/endpoints";
import type { AppEvents, Endpoints } from "./main";

/**
 * The renderer's entire view of main. Both the call surface (`invoke.*`) and the
 * event surface (`subscribe.*`) are derived from the tables declared in
 * `main.ts`, so this bridge stays in lockstep with the backend automatically.
 */
const client = createClient<Endpoints, AppEvents>(ipcRenderer);

contextBridge.exposeInMainWorld("client", client);

declare global {
  interface Window {
    client: typeof client;
  }
}
