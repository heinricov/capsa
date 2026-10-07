import { z } from "zod"

/** Input pembuatan box baru. */
export const createBoxSchema = z.object({
  userId: z.uuid(),
  no: z.string().min(1).max(50),
  description: z.string().max(500).optional().nullable(),
})

/** Semua field opsional — untuk endpoint PATCH/PUT sebagian. */
export const updateBoxSchema = createBoxSchema.partial()

export type CreateBoxInput = z.infer<typeof createBoxSchema>
export type UpdateBoxInput = z.infer<typeof updateBoxSchema>