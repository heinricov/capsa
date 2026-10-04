/** Role account — Single Source of Truth di monorepo Capsa. */
export const ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
