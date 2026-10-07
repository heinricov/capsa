import type { Role } from "@workspace/constants"

import type { RegisterRequest, PublicAccount } from "../types.ts"
import { createAccountSchema } from "../validators.ts"
import type { Requester } from "../../types.ts"

export async function create(
  requester: Requester,
  body: RegisterRequest & { role?: Role }
): Promise<PublicAccount> {
  const data = createAccountSchema.parse(body)
  return requester.request<PublicAccount>("/accounts", {
    method: "POST",
    body: data,
  })
}
