import type { Requester } from "../../types.ts"
import type { PaginatedResponse } from "../../common/types.ts"
import type { PaginationQuery } from "../../common/validators.ts"
import type { PublicBox } from "../types.ts"
import type { CreateBoxInput, UpdateBoxInput } from "../validators.ts"
import type { CreateBoxRequest } from "../types.ts"
import { list } from "./list.ts"
import { get } from "./get.ts"
import { create } from "./create.ts"
import { update } from "./update.ts"
import { deleteBox } from "./delete.ts"

export interface BoxApi {
  list(query?: Partial<PaginationQuery>): Promise<PaginatedResponse<PublicBox>>
  get(id: string): Promise<PublicBox>
  create(body: CreateBoxRequest): Promise<PublicBox>
  update(id: string, body: UpdateBoxInput): Promise<PublicBox>
  delete(id: string): Promise<{ id: string }>
}

export function createBoxApi(requester: Requester): BoxApi {
  return {
    list: (query) => list(requester, query),
    get: (id) => get(requester, id),
    create: (body) => create(requester, body),
    update: (id, body) => update(requester, id, body),
    delete: (id) => deleteBox(requester, id),
  }
}
