# @workspace/api-client

Typed API client untuk berkomunikasi dengan `apps/api` dari `apps/web` maupun `apps/mobile`. Berbasis `fetch` (tanpa axios), response di-type dengan `@workspace/types`, request divalidasi dengan `@workspace/validators`, error memakai `@workspace/errors`.

## Pakai

```ts
import { api } from "@workspace/api-client"

// Login — token otomatis disimpan di memori
const result = await api.accounts.login({
  email: "admin@capsa.com",
  password: "admin1234",
})

// Get profile — otomatis membawa header Authorization: Bearer <token>
const profile = await api.accounts.getProfile()

// Create account (opsional) — role default "USER"
const account = await api.accounts.createAccount({
  name: "Budi",
  email: "budi@example.com",
  password: "rahasia123",
})
```

## Endpoint (kontrak)

| Method          | Path                | Body                                                 | Response data                      |
| --------------- | ------------------- | ---------------------------------------------------- | ---------------------------------- |
| `login`         | `POST /auth/login`  | `LoginRequest` (divalidasi `loginSchema`)            | `LoginResponse { token, account }` |
| `getProfile`    | `GET /auth/profile` | — (butuh token)                                      | `PublicAccount`                    |
| `createAccount` | `POST /accounts`    | `RegisterRequest` (divalidasi `createAccountSchema`) | `PublicAccount`                    |

> `apps/api` belum memiliki endpoint ini — path di atas adalah kontrak yang dipakai sisi client dan akan diimplementasikan di task endpoint API. Response **wajib** berbentuk envelope `ApiResponse<T> { success, message?, data? }`.

## Base URL

Diambil dari environment variable (di-inline oleh bundler masing-masing):

1. `NEXT_PUBLIC_API_URL` (Next.js / Node)
2. `EXPO_PUBLIC_API_URL` (Expo / React Native)
3. fallback `http://localhost:4000`

Untuk device fisik via Expo, set `EXPO_PUBLIC_API_URL=http://<ip-lan>:4000` (bukan `localhost`).

Override per instance: `createApiClient({ baseUrl: "http://localhost:4000" })`.

## Token

`login()` menyimpan `token` hasil response secara otomatis (**in-memory**). Tersedia `setToken()` / `clearToken()` / `getToken()` — persistensi (localStorage/SecureStore) adalah tanggung jawab app masing-masing.

## Error handling

| Status                            | Dilempar sebagai                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 400 / 401 / 403 / 404 / 409 / 422 | `BadRequestError` · `UnauthorizedError` · `ForbiddenError` · `NotFoundError` · `ConflictError` · `ValidationError` |
| ≥ 500                             | `InternalServerError`                                                                                              |
| status lain                       | `ApiError` (custom, bawa `statusCode`)                                                                             |
| fetch gagal (network/abort)       | `ApiNetworkError` (bawa `cause`)                                                                                   |
| input tak valid (client-side)     | `ZodError` — request **tidak** terkirim                                                                            |

```ts
import { ApiNetworkError } from "@workspace/api-client"
import { UnauthorizedError } from "@workspace/errors"

try {
  await api.accounts.login(creds)
} catch (error) {
  if (error instanceof UnauthorizedError) { /* 401 */ }
  if (error instanceof ApiNetworkError) { /* offline / CORS */ }
}
```

## Menambah endpoint baru

Satu fungsi di `accounts.ts` (atau file domain baru) memakai `client.request<T>`:

```ts
async listAccounts(query: PaginationQuery) {
  return requester.request<PaginatedResponse<PublicAccount>>("/accounts", { query })
}
```

## Membuat instance terpisah

```ts
import { createApiClient } from "@workspace/api-client"

const testClient = createApiClient({
  baseUrl: "http://localhost:4000",
  token: "…",
})
await testClient.request<PublicAccount>("/auth/profile")
```
