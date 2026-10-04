import { useEffect, useState } from "react"

/**
 * Tunda perubahan `value` hingga `delay` ms tanpa perubahan — nilai terakhir
 * saja yang lolos. Timer dibersihkan saat value/delay berubah atau unmount.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
