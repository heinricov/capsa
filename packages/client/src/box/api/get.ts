import type { Requester } from "../../types.ts"
import type { PublicBox } from "../types.ts"

export async function get(
  requester: Requester,
  id: string,
): Promise<PublicBox> {
  return requester.request(`/boxes/${id}`)
}