# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

From the repo root:

```bash
pnpm shadcn add <item>
```

This runs the shadcn CLI inside `apps/web` (where `components.json` lives) using
the workspace-installed version, so UI primitives are written to
`packages/ui/src/web/` and app-level components to `apps/web/components/`.

Alternatively, with `npx` (fetches the latest CLI from npm):

```bash
npx shadcn@latest add <item> -c apps/web   # from the repo root
cd apps/web && npx shadcn@latest add <item> # from apps/web
```

Do **not** pass `--overwrite` unless you intend to replace customized
components (e.g. `packages/ui/src/web/button.tsx`).

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/web/button";
```
