import type { Requester } from "../../types.ts"
import type { PublicBox } from "../types.ts"
import type { UpdateBoxInput } from "../validators.ts"

export async function update(
  requester: Requester,
  id: string,
  body: UpdateBoxInput,
): Promise<PublicBox> {
  return requester.request(`/boxes/${id}`, {
    method: "PATCH",
    body,
  })
}