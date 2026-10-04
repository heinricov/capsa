import { UnauthorizedError } from "@workspace/errors"
import type {
  LoginRequest,
  LoginResponse,
  PublicAccount,
  RegisterRequest,
} from "@workspace/types"
import { createAccountSchema, loginSchema } from "@workspace/validators"
import type { ApiRequestOptions } from "./types.ts"

/**
 * Kontrak minimal yang dibutuhkan dari base client — dipenuhi oleh
 * `createApiClient` sehingga accounts API bisa diuji secara terpisah.
 */
export interface Requester {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>
  setToken(token: string): void
  getToken(): string | null
}

export interface AccountsApi {
  login(body: LoginRequest): Promise<LoginResponse>
  getProfile(): Promise<PublicAccount>
  createAccount(body: RegisterRequest): Promise<PublicAccount>
}

export function createAccountsApi(requester: Requester): AccountsApi {
  return {
    async login(body) {
      const data = loginSchema.parse(body)
      const result = await requester.request<LoginResponse>("/auth/login", {
        method: "POST",
        body: data,
      })
      requester.setToken(result.token)
      return result
    },

    async getProfile() {
      if (!requester.getToken()) {
        throw new UnauthorizedError("Missing auth token — login first")
      }
      return requester.request<PublicAccount>("/auth/profile")
    },

    async createAccount(body) {
      const data = createAccountSchema.parse(body)
      return requester.request<PublicAccount>("/accounts", {
        method: "POST",
        body: data,
      })
    },
  }
}
