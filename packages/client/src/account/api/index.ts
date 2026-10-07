import type { PaginatedResponse } from "../../common/types.ts"
import type { PaginationQuery } from "../../common/validators.ts"
import type { Requester } from "../../types.ts"
import type { PublicAccount, RegisterRequest, Role } from "../types.ts"
import type { UpdateAccountInput } from "../validators.ts"
import { create } from "./create.ts"
import { deleteAccount } from "./delete.ts"
import { get } from "./get.ts"
import { list } from "./list.ts"
import { update } from "./update.ts"

export interface AccountApi {
  list(
    query?: Partial<PaginationQuery>
  ): Promise<PaginatedResponse<PublicAccount>>
  get(id: string): Promise<PublicAccount>
  create(body: RegisterRequest & { role?: Role }): Promise<PublicAccount>
  update(id: string, body: UpdateAccountInput): Promise<PublicAccount>
  delete(id: string): Promise<{ id: string }>
}

export function createAccountApi(requester: Requester): AccountApi {
  return {
    list: (query) => list(requester, query),
    get: (id) => get(requester, id),
    create: (body) => create(requester, body),
    update: (id, body) => update(requester, id, body),
    delete: (id) => deleteAccount(requester, id),
  }
}
