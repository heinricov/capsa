import { idSchema } from "../../common/validators.ts"
import type { PublicAccount } from "../types.ts"
import { type UpdateAccountInput, updateAccountSchema } from "../validators.ts"
import type { Requester } from "../../types.ts"

export async function update(
  requester: Requester,
  id: string,
  body: UpdateAccountInput
): Promise<PublicAccount> {
  const validId = idSchema.parse(id)
  const data = updateAccountSchema.parse(body)
  return requester.request<PublicAccount>(`/accounts/${validId}`, {
    method: "PATCH",
    body: data,
  })
}
