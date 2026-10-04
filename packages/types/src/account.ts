/**
 * Kontrak data Account — Single Source of Truth untuk seluruh monorepo.
 * Selaras dengan model `Account` di `packages/db` (Prisma).
 */

/** Role account. Nilainya sama dengan enum `Role` di @workspace/db. */
export type Role = "USER" | "ADMIN"

/** Account lengkap — hanya untuk keperluan server/internal. */
export interface Account {
  id: string
  name: string
  email: string
  phone: string | null
  password: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

/** Versi aman untuk response API (tanpa password). */
export type PublicAccount = Omit<Account, "password">
