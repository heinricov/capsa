# Capsa API

API REST (NestJS 11) untuk Capsa: autentikasi JWT + CRUD Account. Base URL lokal: `http://localhost:4000` (port dari `PORT` di root `.env`).

## Setup

```bash
pnpm install
pnpm --filter @workspace/db db:generate   # regenerasi Prisma client bila perlu
pnpm --filter @workspace/db db:seed       # seed admin@capsa.com/admin1234 (ADMIN) + user@capsa.com/user1234 (USER)

# development
pnpm --filter api start:dev

# production
pnpm --filter api build && pnpm --filter api start:prod
```

Variabel wajib (root `.env`, symlink ke `apps/*/.env`): `PORT`, `DATABASE_URL`, `JWT_SECRET` (min. 32 karakter — aplikasi gagal start bila kurang). Opsional: `LOG_LEVEL` (`debug`/`info`/`warn`/`error`, default `info`) — log keluar dalam JSON dengan timestamp ISO 8601 via `@workspace/logger` (pino).

## Endpoint

Semua endpoint kecuali `POST /auth/login` wajib `Authorization: Bearer <token>`.

| Method | Path              | Body (zod)            | Sukses       | Keterangan |
| ------ | ----------------- | --------------------- | ------------ | ---------- |
| POST   | `/auth/login`     | `loginSchema`         | 201 `{token, account}` | Login generik — pesan error sama untuk email tak dikenal / password salah |
| GET    | `/auth/profile`   | —                     | 200 `PublicAccount` | Akun dari token (401 bila akun sudah dihapus) |
| GET    | `/accounts`       | query `paginationSchema` (`page`, `limit` ≤100) | 200 `{data: Account[], meta}` | Terbungkus envelope: `{success, data: {data, meta}}` |
| GET    | `/accounts/:id`   | `idSchema` (UUID)     | 200 `PublicAccount` | 404 `NOT_FOUND` bila tak ada |
| POST   | `/accounts`       | `createAccountSchema` | 201 `PublicAccount` | `role` default `USER`; duplikat email → 409 `CONFLICT` |
| PATCH  | `/accounts/:id`   | `updateAccountSchema` | 200 `PublicAccount` | Password di-hash ulang (bcrypt 10 ronde); duplikat email → 409 |
| DELETE | `/accounts/:id`   | —                     | 200 `{id}`  | Ulang → 404 `NOT_FOUND` |

### Kontrak response

- Sukses: `{ "success": true, "data": ... }` (interceptor global).
- Gagal: `{ "success": false, "statusCode": ..., "message": "...", "code": "..." }` dengan `code` dari `@workspace/errors` (`BAD_REQUEST`, `UNAUTHORIZED`, `NOT_FOUND`, `CONFLICT`, ...).
- Validasi zod → 400 `BAD_REQUEST`, pesan isu pertama berformat `field: message`.
- `password` tidak pernah ikut dalam respons (`PublicAccount` / `ACCOUNT_SELECT`).

### Catatan keputusan

- **Belum ada role guard** — semua endpoint yang butuh login bisa diakses oleh token `USER` maupun `ADMIN` (by design sementara; `@Roles(ADMIN)` menyusul).
- JWT: klaim `{sub, role, email}`, masa berlaku 24 jam, secret dari `JWT_SECRET`.

## Tests

```bash
pnpm --filter api test       # unit (jest, passWithNoTests — belum ada spec)
pnpm --filter api test:e2e   # e2e smoke level guard/envelope (DB di-mock: test/mocks/workspace-db.ts)
```

Catatan: skrip test memakai `NODE_OPTIONS=--experimental-vm-modules` (wajib agar jest bisa memuat package ESM workspace, mis. `@nestjs/jwt` & Prisma client) dan `moduleNameMapper` yang mengarahkan `@workspace/db` ke mock — test e2e sengaja tidak menyentuh database.
