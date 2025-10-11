// @ts-check
/* eslint-env node */

import esbuild from "esbuild";
import childProcess from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const env = process.env.NODE_ENV ?? "development";

const revision =
  env === "production"
    ? childProcess.execSync("git rev-parse --short HEAD").toString().trim()
    : "local";

const outdir = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "./dist",
);

/**
 * @type {import("esbuild").BuildOptions} commonOptions
 */
const commonOptions = {
  bundle: true,
  outdir,
  sourcemap: true,
  minify: true,
  define: {
    "process.env.commit": JSON.stringify(revision),
    "process.env.NODE_ENV": JSON.stringify(env),
  },
  entryNames: "[name]",
  external: ["electron"],
  loader: {
    ".woff2": "file",
  },
};

fs.rmSync(outdir, { recursive: true, force: true });

esbuild.build({
  ...commonOptions,
  entryPoints: ["src/preload.ts", "src/renderer.tsx"],
  platform: "browser",
});

esbuild.build({
  ...commonOptions,
  entryPoints: ["src/main.ts"],
  platform: "node",
});
