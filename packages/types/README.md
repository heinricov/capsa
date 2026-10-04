# @workspace/types

Single Source of Truth untuk semua type, interface, dan enum yang dipakai
bersama di monorepo Capsa. Murni type — **tanpa logic, tanpa build** (JIT:
source TypeScript langsung diekspor).

## Pakai

```ts
import type { Account, Role, ApiResponse, LoginRequest } from "@workspace/types"

// atau import granular per topik:
import type { PublicAccount } from "@workspace/types/account"
import type { PaginatedResponse } from "@workspace/types/common"
import type { LoginResponse } from "@workspace/types/api"
```

Sebelum bisa di-import, tambahkan dependency dulu di package/app pemakai:

```json
"@workspace/types": "workspace:*"
```

## Isi

| File             | Type                                                     |
| ---------------- | -------------------------------------------------------- |
| `src/account.ts` | `Role`, `Account` (termasuk `password`), `PublicAccount` |
| `src/common.ts`  | `ApiResponse<T>`, `PaginatedResponse<T>`                 |
| `src/api.ts`     | `LoginRequest`, `RegisterRequest`, `LoginResponse`       |

## Catatan

- **Selaras dengan Prisma:** union `Role` (`"USER" | "ADMIN"`) struktural sama
  dengan enum `Role` hasil generate `@workspace/db`, sehingga nilai dari query
  Prisma bisa langsung dipakai di type ini tanpa konversi.
- **Alur perubahan:** ubah kontrak API → ubah package ini; ubah struktur tabel
  → ubah `packages/db/prisma/schema.prisma` lalu sinkronkan type di sini.
- Selalu import sebagai type (`import type { ... }`) karena package ini tidak
  menghasilkan nilai runtime.
