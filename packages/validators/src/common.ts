import { z } from "zod"

/** UUID v4 — untuk semua param `:id` di URL. */
export const idSchema = z.uuid()

/** Query pagination bawaan. `page`/`limit` boleh datang sebagai string (URL). */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export type PaginationQuery = z.infer<typeof paginationSchema>
