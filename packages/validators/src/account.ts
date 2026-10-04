import { ROLES } from "@workspace/constants"
import { z } from "zod"

/** Input pembuatan account baru. `role` default `"USER"`. */
export const createAccountSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.email(),
  phone: z.string().min(10).max(20).optional().nullable(),
  password: z.string().min(8).max(100),
  role: z.enum([ROLES.USER, ROLES.ADMIN]).default(ROLES.USER),
})

/** Semua field opsional — untuk endpoint PATCH/PUT sebagian. */
export const updateAccountSchema = createAccountSchema.partial()

export type CreateAccountInput = z.infer<typeof createAccountSchema>
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>
