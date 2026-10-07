import type { PaginatedResponse } from "../../common/types.ts"
import {
  type PaginationQuery,
  paginationSchema,
} from "../../common/validators.ts"
import type { PublicAccount } from "../types.ts"
import type { Requester } from "../../types.ts"

export async function list(
  requester: Requester,
  query?: Partial<PaginationQuery>
): Promise<PaginatedResponse<PublicAccount>> {
  const params = paginationSchema.parse(query ?? {})
  return requester.request<PaginatedResponse<PublicAccount>>("/accounts", {
    query: params,
  })
}
