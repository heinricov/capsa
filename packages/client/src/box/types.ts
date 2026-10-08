import type { Role } from "@workspace/constants"

export type { Role }

/** Box lengkap — hanya untuk keperluan server/internal. */
export interface Box {
  id: string
  userId: string
  no: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

/** Versi aman untuk response API. */
export type PublicBox = Omit<Box, never>

/** Request pembuatan box baru. */
export interface CreateBoxRequest {
  userId: string
  no: string
  description?: string | null
}

/** Request update box. */
export interface UpdateBoxRequest {
  userId?: string
  no?: string
  description?: string | null
}
