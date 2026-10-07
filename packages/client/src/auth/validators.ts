import { z } from "zod"

/** Input login — struktural identik dengan `LoginRequest`. */
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export type LoginInput = z.infer<typeof loginSchema>
