import type { Requester } from "../../types.ts"
import type { PaginatedResponse } from "../../common/types.ts"
import type { PaginationQuery } from "../../common/validators.ts"
import type { PublicBox } from "../types.ts"

export async function list(
  requester: Requester,
  query?: Partial<PaginationQuery>,
  options?: { signal?: AbortSignal }
): Promise<PaginatedResponse<PublicBox>> {
  return requester.request("/boxes", {
    query: query as Record<
      string,
      string | number | boolean | undefined | null
    >,
    signal: options?.signal,
  })
}
