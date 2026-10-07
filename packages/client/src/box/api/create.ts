import type { Requester } from "../../types.ts"
import type { PublicBox } from "../types.ts"
import type { CreateBoxRequest } from "../types.ts"

export async function create(
  requester: Requester,
  body: CreateBoxRequest,
): Promise<PublicBox> {
  return requester.request("/boxes", {
    method: "POST",
    body,
  })
}