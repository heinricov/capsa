import eslint from "@eslint/js"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import globals from "globals"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for NestJS (Node + TypeScript) services.
 *
 * `tsconfigRootDir` is required for type-aware linting and must point at the
 * consuming app, so this config is exposed as a factory:
 *
 * ```js
 * import { nestjsConfig } from "@workspace/eslint-config/nestjs"
 * export default nestjsConfig(import.meta.dirname)
 * ```
 *
 * @param {string} tsconfigRootDir Absolute path of the consuming app (where its tsconfig.json lives).
 * @returns {import("eslint").Linter.Config[]}
 */
export function nestjsConfig(tsconfigRootDir) {
  return tseslint.config(
    {
      ignores: ["eslint.config.mjs"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        globals: {
          ...globals.node,
          ...globals.jest,
        },
        sourceType: "commonjs",
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    {
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "prettier/prettier": ["error", { endOfLine: "auto" }],
      },
    }
  )
}
