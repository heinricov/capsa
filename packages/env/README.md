# @workspace/env

Single Source of Truth untuk environment variable di monorepo Capsa.
Validasi dilakukan dengan [Zod](https://zod.dev) mengikuti pola t3-env:
schema terpisah untuk **server** dan **client**, object `env` yang sudah
divalidasi dan fully typed, bersifat Just-in-Time (TypeScript source
langsung, tanpa build step).

## Variabel

| Nama                   | Scope  | Contoh                                   | Keterangan            |
| ---------------------- | ------ | ---------------------------------------- | --------------------- |
| `NODE_ENV`             | server | `development` / `test` / `production`    | default `development` |
| `DATABASE_URL`         | server | `postgres://user:pass@localhost:5432/db` | wajib, URL valid      |
| `JWT_SECRET`           | server | minimal 32 karakter                      | wajib                 |
| `NEXT_PUBLIC_API_URL`  | client | `https://api.example.com`                | wajib, URL valid      |
| `NEXT_PUBLIC_APP_NAME` | client | `Capsa`                                  | wajib                 |

- **Server**: hanya dibaca di runtime Node (Next.js server, NestJS). Diakses
  dari browser → **throw** dengan pesan jelas, bukan `undefined`.
- **Client**: di-inline Next.js saat build (prefix `NEXT_PUBLIC_`).

## Cara pakai

```ts
import { env } from "@workspace/env"

env.DATABASE_URL // string (server only)
env.NEXT_PUBLIC_APP_NAME // string (server & client)
```

Tersedia juga `serverEnvSchema`, `clientEnvSchema`, dan tipe
`Env` / `ServerEnv` / `ClientEnv` bila perlu validasi ulang atau
kebutuhan generic.

### React Native (apps/mobile)

Metro/Expo **hanya** meng-inline variabel prefix `EXPO_PUBLIC_`. `index.ts`
membaca `NEXT_PUBLIC_X ?? EXPO_PUBLIC_X`, jadi cukup definisikan di
`apps/mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_NAME=Capsa
```

Field yang diakses tetap sama: `env.NEXT_PUBLIC_API_URL`.

### Skip validasi

Untuk konteks tanpa `.env` (mis. build CI yang tidak butuh env), set:

```
SKIP_ENV_VALIDATION=1
```

Validasi dilewati — gunakan hanya jika memang tidak butuh env yang valid.

## Integrasi TypeScript (wajib untuk app baru)

Paket ini mengimpor file relatif dengan ekstensi `.ts` (contoh:
`./schema.ts`) agar bisa dijalankan langsung oleh Node.js (type stripping)
sekaligus tetap bundler-friendly. Karena itu setiap tsconfig konsumen harus
memilih salah satu flag:

- **App ber-`noEmit`** (web, mobile): `"allowImportingTsExtensions": true`
- **App yang meng-emit JS** (api / nest build):
  `"rewriteRelativeImportExtensions": true` (TypeScript ≥ 5.7)

Sudah dikonfigurasi di `apps/web`, `apps/mobile`, dan `apps/api`.

## Catatan runtime apps/api

`@workspace/env` mengekspor TypeScript source langsung. Next.js, Metro, dan
`nest build` sudah terverifikasi mengonsumsinya (dependency `zod` ikut
ter-bundle). Node.js ≥ 22.18 (type stripping) bisa membacanya langsung —
repo ini memakai Node v24.
