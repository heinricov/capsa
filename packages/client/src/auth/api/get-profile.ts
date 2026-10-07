import { UnauthorizedError } from "@workspace/errors"

import type { PublicAccount } from "../../account/types.ts"
import type { Requester } from "../../types.ts"

export async function getProfile(requester: Requester): Promise<PublicAccount> {
  if (!requester.getToken()) {
    throw new UnauthorizedError("Missing auth token — login first")
  }
  return requester.request<PublicAccount>("/auth/profile")
}
