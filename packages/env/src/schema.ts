import { z } from "zod"

/**
 * Server-only variables. Never sent to the browser — accessing them from a
 * client bundle throws a descriptive error (see index.ts).
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
})

/**
 * Client variables. Must use the `NEXT_PUBLIC_` prefix so Next.js inlines
 * them at build time. On React Native (Metro) only `EXPO_PUBLIC_*` is
 * inlined, so index.ts falls back to the `EXPO_PUBLIC_` twin of each key.
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>
export type Env = ServerEnv & ClientEnv
