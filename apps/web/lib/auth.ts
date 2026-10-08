import {
  AUTH_COOKIE_NAME,
  AUTH_TOKEN_MAX_AGE_SECONDS,
} from "@workspace/constants"

/** Baca token JWT dari cookie. `null` bila tidak ada (atau di server). */
export function getToken(): string | null {
  if (typeof document === "undefined") return null
  const prefix = `${AUTH_COOKIE_NAME}=`
  const part = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix))
  if (!part) return null
  const value = decodeURIComponent(part.slice(prefix.length))
  return value.length > 0 ? value : null
}

/** Simpan token ke cookie (JS-readable — proxy Next butuh akses). */
export function setToken(token: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
    token
  )}; path=/; max-age=${AUTH_TOKEN_MAX_AGE_SECONDS}; samesite=lax`
}

/** Hapus token dari cookie. */
export function clearToken(): void {
  if (typeof document === "undefined") return
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
}
