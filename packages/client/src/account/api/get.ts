import { idSchema } from "../../common/validators.ts"
import type { PublicAccount } from "../types.ts"
import type { Requester } from "../../types.ts"

export async function get(
  requester: Requester,
  id: string
): Promise<PublicAccount> {
  const validId = idSchema.parse(id)
  return requester.request<PublicAccount>(`/accounts/${validId}`)
}
