import type { Requester } from "../../types.ts"

export async function deleteBox(
  requester: Requester,
  id: string,
): Promise<{ id: string }> {
  return requester.request(`/boxes/${id}`, {
    method: "DELETE",
  })
}