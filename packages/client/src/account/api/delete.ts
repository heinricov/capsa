import { idSchema } from "../../common/validators.ts"
import type { Requester } from "../../types.ts"

export async function deleteAccount(
  requester: Requester,
  id: string
): Promise<{ id: string }> {
  const validId = idSchema.parse(id)
  return requester.request<{ id: string }>(`/accounts/${validId}`, {
    method: "DELETE",
  })
}
