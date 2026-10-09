import { fileURLToPath } from "node:url"

// Absolute path so Prettier resolves the plugin from this package's own
// dependencies regardless of the cwd each format script runs from.
const tailwindcss = fileURLToPath(
  import.meta.resolve("prettier-plugin-tailwindcss")
)

/**
 * Shared Prettier configuration for the whole monorepo.
 *
 * Import it from a `prettier.config.mjs` at the package root:
 *
 * ```js
 * import config from "@workspace/prettier-config"
 * export default config
 * ```
 */
export default {
  endOfLine: "lf",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  plugins: [tailwindcss],
  // Absolute so it resolves regardless of the cwd Prettier runs from.
  tailwindStylesheet: fileURLToPath(
    new URL("../../packages/ui/web/src/styles/globals.css", import.meta.url)
  ),
  tailwindFunctions: ["cn", "cva"],
}
