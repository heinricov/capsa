# @workspace/hooks

Custom React hooks yang dipakai bersama oleh `apps/web` dan `apps/mobile`. Murni React — tanpa dependensi platform.

## Hooks

### `useDisclosure`

```ts
import { useDisclosure } from "@workspace/hooks"

const { isOpen, onOpen, onClose, onToggle } = useDisclosure()
const drawer = useDisclosure(true) // terbuka dari awal
```

Kontrol open/close untuk modal, drawer, popover, dll. Callback (`onOpen`/`onClose`/`onToggle`) berreferensi stabil — aman dipakai di dependency array efek.

### `useDebounce`

```ts
import { useDebounce } from "@workspace/hooks"

const debouncedSearch = useDebounce(search, 300) // delay default 300ms
```

Menunda perubahan `value` hingga `delay` ms; hanya nilai terakhir yang lolos. Timer dibersihkan otomatis saat value/delay berubah atau component unmount.

### `useMediaQuery`

```ts
import { useMediaQuery } from "@workspace/hooks"

const isDesktop = useMediaQuery("(min-width: 1024px)")
const isTablet = useMediaQuery("(min-width: 768px)", false) // defaultValue
```

**Web-first dengan fallback aman lintas platform:**

| Lingkungan      | Perilaku                                                     |
| --------------- | ------------------------------------------------------------ |
| Browser modern  | nilai live + update saat query berubah (`change` event)      |
| SSR / hydration | `defaultValue` saat render server → bebas hydration mismatch |
| React Native    | `window.matchMedia` tidak ada → `defaultValue`               |

Catatan: butuh browser dengan `MediaQueryList.addEventListener` (Safari 14+, Chrome 64+, Firefox 104+).

## Panduan

- Hanya hooks yang reusable lintas app yang masuk package ini; hooks yang terikat platform (mis. yang butuh `expo-secure-store`) tetap di app masing-masing.
- Mengikuti Rules of Hooks; semua hooks type-safe.
