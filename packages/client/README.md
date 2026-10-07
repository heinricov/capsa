# @workspace/client

Kontrak domain (types + validator Zod) **dan** typed API client untuk berkomunikasi dengan `apps/api` dari `apps/web` maupun `apps/mobile`. Berbasis `fetch` (tanpa axios), error memakai `@workspace/errors`.

> Package ini dulunya terpisah jadi `@workspace/types` + `@workspace/validators` + `@workspace/api-client`. Sekarang kontrak dipindah total ke sini, per domain — supaya tiap folder self-contained (`account/`, `auth/`, `common/`).

## Struktur

```
src/
├── client.ts          # transport: request, token, mapping error → api.account + api.auth
├── types.ts           # ApiRequestOptions, ApiRequestOptions, Requester
├── common/            # kontrak lintas domain (ApiResponse, PaginatedResponse, id/pagination schema)
├── account/           # domain Account — types, validators, api/{list,get,create,update,delete}.ts
└── auth/              # domain Auth — types, validators, api/{login,get-profile,logout}.ts
```

## Pakai (app: web/mobile)

```ts
import { api } from "@workspace/client"

// Auth
const { token } = await api.auth.login({
  email: "admin@capsa.com",
  password: "admin1234",
})
const profile = await api.auth.getProfile()
api.auth.logout()

// Account
const page = await api.account.list({ page: 1, limit: 10 })
const one = await api.account.get("uuid…")
const created = await api.account.create({
  name: "Budi",
  email: "budi@example.com",
  password: "rahasia123",
  role: "ADMIN",
})
const updated = await api.account.update("uuid…", { name: "Budi Santoso" })
await api.account.delete("uuid…")
```

## Pakai kontrak saja (server Nest / kode yang tidak memanggil API)

Import lewat **subpath** — hanya memuat types + schema Zod, tanpa transport:

```ts
import {
  type PublicAccount,
  createAccountSchema,
} from "@workspace/client/account"
import { loginSchema, type LoginRequest } from "@workspace/client/auth"
import {
  type PaginatedResponse,
  idSchema,
  paginationSchema,
} from "@workspace/client/common"
```

Jangan import root `@workspace/client` di server — root ikut mengeksekusi `createApiClient()`.

## Endpoint (kontrak)

| Namespace             | Method   | Path            | Body (divalidasi client)           | Response data                      |
| --------------------- | -------- | --------------- | ---------------------------------- | ---------------------------------- |
| `api.auth.login`      | `POST`   | `/auth/login`   | `loginSchema`                      | `LoginResponse { token, account }` |
| `api.auth.getProfile` | `GET`    | `/auth/profile` | — (butuh token)                    | `PublicAccount`                    |
| `api.auth.logout`     | —        | —               | — (clear token in-memory)          | `void`                             |
| `api.account.list`    | `GET`    | `/accounts`     | query: `paginationSchema`          | `PaginatedResponse<PublicAccount>` |
| `api.account.get`     | `GET`    | `/accounts/:id` | — (validasi `idSchema`)            | `PublicAccount`                    |
| `api.account.create`  | `POST`   | `/accounts`     | `createAccountSchema`              | `PublicAccount`                    |
| `api.account.update`  | `PATCH`  | `/accounts/:id` | `idSchema` + `updateAccountSchema` | `PublicAccount`                    |
| `api.account.delete`  | `DELETE` | `/accounts/:id` | `idSchema`                         | `{ id }`                           |

Response server wajib berbentuk envelope `ApiResponse<T> { success, message?, data? }` — client me-unwrap `data` dan melempar error sesuai status.

## Base URL

Diambil dari environment variable (di-inline oleh bundler masing-masing):

1. `NEXT_PUBLIC_API_URL` (Next.js / Node)
2. `EXPO_PUBLIC_API_URL` (Expo / React Native)
3. fallback `http://localhost:4000`

Untuk device fisik via Expo, set `EXPO_PUBLIC_API_URL=http://<ip-lan>:4000` (bukan `localhost`).

Override per instance: `createApiClient({ baseUrl: "http://localhost:4000" })`.

## Token

`api.auth.login()` menyimpan `token` hasil response secara otomatis (**in-memory**). `api.auth.logout()` menghapusnya. Persistensi (localStorage/SecureStore) adalah tanggung jawab app masing-masing — pakai `setToken()` / `getToken()`.

## Error handling

| Status                            | Dilempar sebagai                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 400 / 401 / 403 / 404 / 409 / 422 | `BadRequestError` · `UnauthorizedError` · `ForbiddenError` · `NotFoundError` · `ConflictError` · `ValidationError` |
| ≥ 500                             | `InternalServerError`                                                                                              |
| status lain                       | `ApiError` (custom, bawa `statusCode`)                                                                             |
| fetch gagal (network/abort)       | `ApiNetworkError` (bawa `cause`)                                                                                   |
| input tak valid (client-side)     | `ZodError` — request **tidak** terkirim                                                                            |

```ts
import { ApiNetworkError } from "@workspace/client"
import { UnauthorizedError } from "@workspace/errors"

try {
  await api.auth.login(creds)
} catch (error) {
  if (error instanceof UnauthorizedError) {
    /* 401 */
  }
  if (error instanceof ApiNetworkError) {
    /* offline / CORS */
  }
}
```

## Menambah endpoint baru

Satu fungsi di folder domain-nya (`src/<domain>/api/<nama>.ts`) memakai `requester.request<T>`, lalu daftarkan di `src/<domain>/api/index.ts`:

```ts
// src/account/api/archive.ts
export async function archive(requester: Requester, id: string) {
  const validId = idSchema.parse(id)
  return requester.request<PublicAccount>(`/accounts/${validId}/archive`, {
    method: "POST",
  })
}
```

## Membuat instance terpisah

```ts
import { createApiClient } from "@workspace/client"

const testClient = createApiClient({
  baseUrl: "http://localhost:4000",
  token: "…",
})
await testClient.account.get("uuid…")
```
