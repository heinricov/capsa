# shadcn/ui monorepo template

opencode -s ses_f0461b878ffeW26oSGhJUMoFIM

This is a Next.js monorepo template with shadcn/ui.

## Environment

Satu file `.env` di **root** repo (di-gitignore) dipakai semua app/package:

```bash
cp .env.example .env
openssl rand -hex -32   # tempel ke JWT_SECRET
```

Konsumen membacanya otomatis lewat symlink `.env` per direktori:

| Lokal              | Dibaca oleh                            |
| ------------------ | -------------------------------------- |
| `apps/web/.env`    | Next.js (auto-load `NEXT_PUBLIC_*`)    |
| `apps/mobile/.env` | Expo/Metro (auto-load `EXPO_PUBLIC_*`) |
| `apps/api/.env`    | `dotenv` di `src/main.ts`              |
| `packages/db/.env` | `prisma.config.ts` / seed (dotenv)     |

Validasi terpusat ada di `@workspace/env` (`packages/env`).

## Adding components

From the repo root:

```bash
pnpm shadcn add <item>
```

This runs the shadcn CLI inside `apps/web` (where `components.json` lives) using
the workspace-installed version, so UI primitives are written to
`packages/ui/web/src/` and app-level components to `apps/web/components/`.

Alternatively, with `npx` (fetches the latest CLI from npm):

```bash
npx shadcn@latest add <item> -c apps/web   # from the repo root
cd apps/web && npx shadcn@latest add <item> # from apps/web
```

Do **not** pass `--overwrite` unless you intend to replace customized
components (e.g. `packages/ui/web/src/web/button.tsx`).

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/web/web/button";
```
