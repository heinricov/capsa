# @workspace/logger

Single Source of Truth untuk logging monorepo Capsa. Di atas [pino](https://github.com/pinojs/pino) (level `debug`/`info`/`warn`/`error`, timestamp ISO 8601, context object), dengan API yang sama di Node.js maupun di browser.

## Pakai

```ts
import { logger } from "@workspace/logger"

logger.info("Server started")
logger.error("Failed to create account", { error, userId })
logger.debug("Debug info", { payload })
```

`context` adalah object opsional kedua. Nilai ber-tipe `Error` otomatis diserialisasi pino (`message`/`stack` ikut tercatat).

## Instance & konfigurasi

```ts
import { createLogger } from "@workspace/logger"

const log = createLogger({ level: "debug" })
const reqLog = log.child({ requestId }) // context permanen
```

| Opsi          | Default                                 | Keterangan                                                                      |
| ------------- | --------------------------------------- | ------------------------------------------------------------------------------- |
| `level`       | env `LOG_LEVEL` (bila valid) → `"info"` | `debug` \| `info` \| `warn` \| `error`                                          |
| `destination` | stdout (JSON lines)                     | `DestinationStream` pino — titik ekstensi untuk transport file/external service |

## Perilaku per environment

- **Node.js (server)** — pino, JSON lines ke stdout.
- **Browser (client bundle)** — **no-op senyap**: method & `child()` tetap ada agar kode aman di-import di mana saja, tetapi tidak ada output. Logging utama ada di server; untuk debugging client gunakan `console.log` biasa.

## Catatan

- **Timestamp**: ISO 8601 (`"time":"2026-10-04T08:15:30.123Z"`).
- **Pretty-print saat dev**: `npx pino-pretty` — opsional, tanpa dependency package (mis. `createLogger({ destination: ... })` atau CLI `pino-pretty`).
- **Next.js**: tambahkan `"@workspace/logger"` ke `transpilePackages` (package ini mengekspor source TS, pola JIT monorepo).
- **NestJS**: saat wiring nanti gunakan `nestjs-pino` atau lewat `destination` transport — API `logger` tetap sama.
