import globals from "globals"

import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    files: ["*.js", "*.cjs", "*.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
