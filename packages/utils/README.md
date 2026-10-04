# @workspace/utils

Utility functions **pure** untuk seluruh monorepo Capsa. JIT — source
TypeScript langsung diekspor, tanpa build step, **tanpa dependency eksternal**.

## Pakai

```ts
import { capitalize, formatDate, omit, sleep } from "@workspace/utils"

// atau import granular per topik:
import { slugify, truncate } from "@workspace/utils/string"
import { isValidDate } from "@workspace/utils/date"
import { pick } from "@workspace/utils/object"
```

Sebelum bisa di-import, tambahkan dependency dulu:

```json
"@workspace/utils": "workspace:*"
```

## Isi

| Fungsi                      | Perilaku                                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `capitalize(str)`           | Huruf pertama kapital, sisanya diubah. `""` → `""`                                                             |
| `slugify(str)`              | `"  Café Au Lait!  "` → `"cafe-au-lait"` — buang aksen, lowercase, non-alnum → `-`                             |
| `truncate(str, length)`     | Hasil (**termasuk `...`**) ≤ `length`; sudah pendek dikembalikan utuh; `length < 3` tanpa ellipsis             |
| `formatDate(date, locale?)` | `dateStyle: "medium"` via `Intl`; `locale` default locale runtime; **input tidak valid melempar `RangeError`** |
| `isValidDate(date)`         | `Date` valid **atau** string yang bisa di-parse (`"abc"` → false)                                              |
| `omit(obj, keys)`           | Objek baru tanpa `keys` — input tidak dimutasi                                                                 |
| `pick(obj, keys)`           | Objek baru berisi `keys` — input tidak dimutasi                                                                |
| `sleep(ms)`                 | `Promise<void>` yang resolve setelah `ms`                                                                      |

## Catatan

- Semua fungsi pure (kecuali `sleep` yang menjadwalkan timer — API bawaan JS,
  berjalan di Node maupun browser).
- **Next.js:** saat mulai dipakai, tambahkan `"@workspace/utils"` ke
  `transpilePackages` (mengekspor nilai runtime, seperti
  `@workspace/constants`).
- Locale `formatDate` mengikuti runtime — output bisa beda antar mesin;
  jangan menguji hasilnya dengan string hardcoded.
