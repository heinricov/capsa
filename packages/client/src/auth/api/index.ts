import type { PublicAccount } from "../../account/types.ts"
import type { Requester } from "../../types.ts"
import type { LoginRequest, LoginResponse } from "../types.ts"
import { getProfile } from "./get-profile.ts"
import { login } from "./login.ts"
import { logout } from "./logout.ts"

export interface AuthApi {
  login(
    body: LoginRequest,
    options?: { signal?: AbortSignal }
  ): Promise<LoginResponse>
  getProfile(): Promise<PublicAccount>
  logout(): void
}

export function createAuthApi(requester: Requester): AuthApi {
  return {
    login: (body, options) => login(requester, body, options),
    getProfile: () => getProfile(requester),
    logout: () => logout(requester),
  }
}
