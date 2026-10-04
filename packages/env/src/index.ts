import { z } from "zod"
import { clientEnvSchema, serverEnvSchema, type Env } from "./schema.ts"

const isServer = typeof window === "undefined"
const skipValidation =
  process.env.SKIP_ENV_VALIDATION === "true" ||
  process.env.SKIP_ENV_VALIDATION === "1"

/**
 * Reads the client-side variables with static member access — bundlers
 * (Next.js webpack/Turbopack, Metro/Expo) only inline `process.env.<LITERAL>`.
 *
 * Metro does not inline `NEXT_PUBLIC_*`, so each key falls back to its
 * `EXPO_PUBLIC_*` twin, which Expo inlines from `.env` files.
 */
function readClientEnv(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? process.env.EXPO_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME ?? process.env.EXPO_PUBLIC_APP_NAME,
  }
}

function createEnv(): Env {
  if (skipValidation) {
    return { ...readClientEnv() } as unknown as Env
  }

  if (isServer) {
    const schema = z.object({
      ...serverEnvSchema.shape,
      ...clientEnvSchema.shape,
    })
    const result = schema.safeParse(process.env)
    if (!result.success) {
      throw new Error(
        `Invalid environment variables:\n${z.prettifyError(result.error)}`
      )
    }
    return result.data
  }

  const result = clientEnvSchema.safeParse(readClientEnv())
  if (!result.success) {
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`
    )
  }

  // Proxy so that touching a server-side variable in the browser fails with a
  // clear message instead of silently resolving to undefined.
  return new Proxy(result.data as Env, {
    get(target, prop) {
      if (typeof prop === "string" && prop in serverEnvSchema.shape) {
        throw new Error(
          `"${prop}" is a server-side environment variable and cannot be accessed in the browser.`
        )
      }
      return Reflect.get(target, prop)
    },
  })
}

export const env: Env = createEnv()
export { clientEnvSchema, serverEnvSchema } from "./schema.ts"
export type { ClientEnv, Env, ServerEnv } from "./schema.ts"
