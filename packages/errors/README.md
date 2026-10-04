# @workspace/errors

Single Source of Truth untuk custom error classes dan error handling di
monorepo Capsa. JIT — source TypeScript langsung diekspor, tanpa build step.

## Pakai

```ts
import {
  AppError,
  NotFoundError,
  ValidationError,
  ErrorCode,
} from "@workspace/errors"

throw new NotFoundError("Account tidak ditemukan")

// import granular:
import { AppError } from "@workspace/errors/base"
import { BadRequestError } from "@workspace/errors/http"
import { ErrorCode } from "@workspace/errors/codes"
```

Sebelum bisa di-import, tambahkan dependency dulu:

```json
"@workspace/errors": "workspace:*"
```

## Kelas error

| Kelas                 | `statusCode` | `code`                  | `isOperational` |
| --------------------- | ------------ | ----------------------- | --------------- |
| `BadRequestError`     | 400          | `BAD_REQUEST`           | true            |
| `UnauthorizedError`   | 401          | `UNAUTHORIZED`          | true            |
| `ForbiddenError`      | 403          | `FORBIDDEN`             | true            |
| `NotFoundError`       | 404          | `NOT_FOUND`             | true            |
| `ConflictError`       | 409          | `CONFLICT`              | true            |
| `ValidationError`     | 422          | `VALIDATION_ERROR`      | true            |
| `InternalServerError` | 500          | `INTERNAL_SERVER_ERROR` | **false**       |

`AppError` juga bisa dipakai langsung untuk error kustom:

```ts
throw new AppError("Rate limit terlampaui", 429, ErrorCode.BAD_REQUEST)
```

## Catatan

- `isOperational = false` (mis. `InternalServerError`) menandai error yang
  kemungkinan bug — **jangan tampilkan detail internalnya** ke pengguna;
  cukup pesan generik + log untuk tim.
- `err.name` otomatis = nama kelas (`"NotFoundError"`), sehingga log/readable
  stack trace jelas.
- **NestJS:** buat global `ExceptionFilter` yang membaca `statusCode`/`code`
  dari `AppError` (fallback 500 untuk error tak dikenal).
- **Next.js:** saat mulai dipakai, tambahkan `"@workspace/errors"` ke
  `transpilePackages` (package ini mengekspor nilai runtime, seperti
  `@workspace/constants`).
