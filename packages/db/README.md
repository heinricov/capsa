# @workspace/db

Prisma 7 (PostgreSQL) — paket database bersama untuk seluruh workspace.

## Setup

1. Salin `DATABASE_URL` ke `.env` di root repo (file `.env` sudah di-gitignore):

   ```bash
   DATABASE_URL="postgresql://postgres@localhost:5432/capsa"
   ```

2. Sinkronkan schema & isi seed:

   ```bash
   pnpm --filter @workspace/db db:push
   pnpm --filter @workspace/db db:seed
   ```

## Perintah

| Script                                    | Fungsi                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @workspace/db db:generate` | Regenerasi client ke `src/generated/prisma/` — **jalankan setiap kali mengubah `prisma/schema.prisma`**, hasilnya di-commit |
| `pnpm --filter @workspace/db db:push`     | Sinkronkan schema ke database (tanpa file migration)                                                                        |
| `pnpm --filter @workspace/db db:migrate`  | Buat migration dev (mengisi `prisma/migrations/`)                                                                           |
| `pnpm --filter @workspace/db db:seed` | Isi akun seed (lihat di bawah) |
| `pnpm --filter @workspace/db db:studio`   | Prisma Studio (GUI)                                                                                                         |

## Akun seed

| Email | Password | Role |
| --- | --- | --- |
| `admin@capsa.com` | `admin1234` | ADMIN |
| `user@capsa.com` | `user1234` | USER |

## Pakai di app lain

```ts
import { prisma, type Account, Role } from "@workspace/db"
```

Singleton Prisma dengan driver adapter `@prisma/adapter-pg`. Import tidak membutuhkan `DATABASE_URL` — koneksi dibuat saat query pertama.

## Catatan Prisma 7

- Konfigurasi ada di `prisma.config.ts` (schema path, datasource URL, seed command) — URL tidak lagi ditulis di `schema.prisma`.
- `.env` tidak dimuat otomatis; `prisma.config.ts` dan `prisma/seed.ts` memuatnya manual via `dotenv/config`.
- Hasil generate (`src/generated/prisma/`) di-commit agar typecheck/CI jalan tanpa langkah tambahan.
