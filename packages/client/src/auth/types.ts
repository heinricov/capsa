import type { PublicAccount } from "../account/types.ts"

/** Request login. */
export interface LoginRequest {
  email: string
  password: string
}

/** Response sukses login — password tidak pernah ikut. */
export interface LoginResponse {
  token: string
  account: PublicAccount
}
