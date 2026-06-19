// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslintJs from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default defineConfig([
  globalIgnores(["dist/", "out/"]),
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      parser: typescriptEslintParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: { "@typescript-eslint": typescriptEslintPlugin },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },
  ...storybook.configs["flat/recommended"],
]);
