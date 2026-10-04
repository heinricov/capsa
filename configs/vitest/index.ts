import { defineConfig, type ViteUserConfig } from "vitest/config"

/**
 * Shared Vitest configuration for the monorepo.
 *
 * Consumer usage (Vite bundles the config, so importing TS source is fine):
 *
 * ```ts
 * import { mergeConfig, defineConfig } from "vitest/config"
 * import { node } from "@workspace/vitest-config"
 *
 * export default mergeConfig(node, defineConfig({ test: { environment: "node" } }))
 * ```
 *
 * Environments:
 * - `node`     – default for packages/services
 * - `jsdom`    – browser-ish components (requires `jsdom` in the consumer)
 * - `happyDom` – lighter alternative (requires `happy-dom` in the consumer)
 */

const baseTest: NonNullable<ViteUserConfig["test"]> = {
  clearMocks: true,
  restoreMocks: true,
  coverage: {
    provider: "v8",
    reporter: ["text", "lcov"],
  },
}

export const node = defineConfig({
  test: {
    ...baseTest,
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})

export const jsdom = defineConfig({
  test: {
    ...baseTest,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})

export const happyDom = defineConfig({
  test: {
    ...baseTest,
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})

export default node
