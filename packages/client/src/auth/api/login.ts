import type { Requester } from "../../types.ts"
import type { LoginRequest, LoginResponse } from "../types.ts"
import { loginSchema } from "../validators.ts"

export async function login(
  requester: Requester,
  body: LoginRequest,
  options?: { signal?: AbortSignal }
): Promise<LoginResponse> {
  const data = loginSchema.parse(body)
  const result = await requester.request<LoginResponse>("/auth/login", {
    method: "POST",
    body: data,
    signal: options?.signal,
  })
  requester.setToken(result.token)
  return result
}
