# @workspace/constants

Single Source of Truth untuk konstanta yang dipakai bersama di monorepo
Capsa. Murni konstanta (`as const`) — **tanpa logic/fungsi, tanpa build**
(JIT: source TypeScript langsung diekspor).

## Pakai

```ts
import {
  ROLES,
  APP_NAME,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from "@workspace/constants"

import { ACCOUNT_STATUS } from "@workspace/constants/account"
import { ROLES as ROLES2, type Role } from "@workspace/constants/role"
```

Sebelum bisa di-import, tambahkan dependency dulu di package/app pemakai:

```json
"@workspace/constants": "workspace:*"
```

Berbeda dengan `@workspace/types` (type-only), package ini mengekspor
**nilai runtime** — di Next.js saat nanti dipakai, tambahkan ke
`transpilePackages` di `next.config.ts`.

## Isi

| File             | Konstanta                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `src/role.ts`    | `ROLES` + type `Role` — **pemilik tunggal `Role`** (di-re-export oleh `@workspace/types`)             |
| `src/account.ts` | `ACCOUNT_STATUS` + type `AccountStatus` (belum dipakai model `Account` di db — disiapkan untuk nanti) |
| `src/app.ts`     | `APP_NAME = "Capsa"`, `DEFAULT_PAGE_SIZE = 10`, `MAX_PAGE_SIZE = 100`                                 |

## Catatan

- `Role` struktural sama dengan enum `Role` hasil generate `@workspace/db`
  sehingga nilai dari Prisma bisa langsung dipakai.
- `APP_NAME` sengaja sama dengan `NEXT_PUBLIC_APP_NAME` /
  `EXPO_PUBLIC_APP_NAME` di `.env`.
- Alur perubahan: ubah nilai konstanta di sini → konsumen ikut saat
  typecheck/build ulang (JIT, tanpa build step).
