# @workspace/validators

Single Source of Truth untuk semua Zod schema / validasi di monorepo Capsa.
JIT — source TypeScript langsung diekspor, tanpa build step.

> **Versi Zod:** package ini (dan `@workspace/env`) memakai **`zod@^4.6.5`**
> — saat ini menjadi versi yang ter-hoist di root `node_modules`. Dependensi
> eksternal yang butuh Zod 3 (shadcn, MCP SDK, Expo CLI, …) membawa salinan 3.x
> sendiri di `node_modules/<pkg>/zod`. Bila app meng-import `zod` langsung,
> deklarasikan `"zod": "^4.6.5"` sendiri agar API-nya sama (`z.email()`,
> `z.url()`, dst) tanpa bergantung pada hasil hoisting.

## Pakai

```ts
import {
  createAccountSchema,
  loginSchema,
  paginationSchema,
} from "@workspace/validators"
import type { CreateAccountInput, LoginInput } from "@workspace/validators"

const input = createAccountSchema.parse(body) // melempar ZodError bila tidak valid

// import granular:
import { updateAccountSchema } from "@workspace/validators/account"
import { loginSchema } from "@workspace/validators/auth"
import { idSchema } from "@workspace/validators/common"
```

Sebelum bisa di-import, tambahkan dependency dulu:

```json
"@workspace/validators": "workspace:*"
```

## Isi

| Schema                | Type inference       | Catatan                                                             |
| --------------------- | -------------------- | ------------------------------------------------------------------- |
| `idSchema`            | —                    | UUID v4 untuk param `:id`                                           |
| `paginationSchema`    | `PaginationQuery`    | `page`/`limit` di-coerce dari string; default `1`/`10`, limit ≤ 100 |
| `createAccountSchema` | `CreateAccountInput` | `role` default `"USER"` (dari `@workspace/constants`)               |
| `updateAccountSchema` | `UpdateAccountInput` | `.partial()` — semua field opsional                                 |
| `loginSchema`         | `LoginInput`         | identik struktural dengan `LoginRequest` di `@workspace/types`      |

## Catatan

- **Enum role** diambil dari `ROLES` (`@workspace/constants`) — bukan literal
  duplikat, sehingga `z.infer<…>["role"]` = type `Role` milik
  `@workspace/types`/`@workspace/constants`.
- Gaya API **Zod 4 top-level** (`z.email()`, `z.uuid()`), konsisten dengan
  `@workspace/env`.
- Validasi dijalankan di satu tempat saja (NestJS `ValidationPipe`, server
  action, atau client form) — jangan menulis ulang aturan min/max/email di
  tempat lain.
- **Next.js:** saat mulai dipakai, tambahkan `"@workspace/validators"` ke
  `transpilePackages` (package ini mengekspor nilai runtime).
