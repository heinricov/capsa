import { useSyncExternalStore } from "react"

function canMatchMedia(): boolean {
  return (
    typeof window !== "undefined" && typeof window.matchMedia === "function"
  )
}

function getMatch(query: string, defaultValue: boolean): boolean {
  if (!canMatchMedia()) return defaultValue
  return window.matchMedia(query).matches
}

function subscribe(query: string, onChange: () => void): () => void {
  if (!canMatchMedia()) return () => undefined
  const mediaQueryList = window.matchMedia(query)
  mediaQueryList.addEventListener("change", onChange)
  return () => mediaQueryList.removeEventListener("change", onChange)
}

/**
 * Baca media query CSS — web-first, aman dipanggil di React Native / SSR:
 * ketika `window.matchMedia` tidak tersedia, mengembalikan `defaultValue`.
 * Snapshot server = `defaultValue` sehingga hydration bebas mismatch.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  return useSyncExternalStore(
    (onChange) => subscribe(query, onChange),
    () => getMatch(query, defaultValue),
    () => defaultValue
  )
}
