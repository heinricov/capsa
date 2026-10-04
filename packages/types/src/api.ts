import type { PublicAccount } from "./account.ts"

/** Request login. */
export interface LoginRequest {
  email: string
  password: string
}

/** Request registrasi account baru. */
export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone?: string | null
}

/** Response sukses login — password tidak pernah ikut. */
export interface LoginResponse {
  token: string
  account: PublicAccount
}
