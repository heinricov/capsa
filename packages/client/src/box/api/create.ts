import type { Requester } from "../../types.ts"
import type { PublicBox } from "../types.ts"
import type { CreateBoxRequest } from "../types.ts"

export async function create(
  requester: Requester,
  body: CreateBoxRequest,
  options?: { signal?: AbortSignal }
): Promise<PublicBox> {
  return requester.request("/boxes", {
    method: "POST",
    body,
    signal: options?.signal,
  })
}
