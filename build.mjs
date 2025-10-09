// ts-check
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

import esbuild from "esbuild";
import childProcess from "node:child_process";
import path from "path";

const env = process.env.NODE_ENV ?? "development";

const revision =
  env === "production"
    ? childProcess.execSync("git rev-parse --short HEAD").toString().trim()
    : "local";

/**
 * @type {import("esbuild").BuildOptions} commonOptions
 */
const commonOptions = {
  bundle: true,
  outdir: path.join(process.cwd(), "dist"),
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

esbuild.build({
  ...commonOptions,
  entryPoints: ["src/preload.ts", "src/renderer.tsx"],
});

esbuild.build({
  ...commonOptions,
  entryPoints: ["src/main.ts"],
  platform: "node",
});
