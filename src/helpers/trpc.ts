import { createTRPCClient } from "@trpc/client";
import { ipcLink } from "electron-trpc-experimental/renderer";
import type { AppRouter } from "../main";

/**
 * The renderer's typed gateway to main. Every procedure, its inputs, and its
 * outputs are inferred from `AppRouter` — the boundary cannot drift from the
 * server. `import type` keeps `main.ts` (and its Node-only imports) out of the
 * renderer bundle.
 */
export const client = createTRPCClient<AppRouter>({
  links: [ipcLink()],
});
