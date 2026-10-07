import type { Requester } from "../../types.ts"

export function logout(requester: Requester): void {
  requester.clearToken()
}
