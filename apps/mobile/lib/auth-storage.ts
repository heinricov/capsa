import { AUTH_STORAGE_KEY } from "@workspace/constants"
import * as SecureStore from "expo-secure-store"

/** Baca token tersimpan (null bila belum pernah login / gagal baca). */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_STORAGE_KEY)
  } catch {
    return null
  }
}

/** Simpan token (keychain/keystore). Gagal = token hanya di memori sesi ini. */
export async function setToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(AUTH_STORAGE_KEY, token)
  } catch {
    /* storage tidak tersedia (mis. web) — abaikan */
  }
}

/** Hapus token (logout). Gagal = abaikan. */
export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY)
  } catch {
    /* storage tidak tersedia (mis. web) — abaikan */
  }
}

/**
 * Cek kedaluwarsa JWT tanpa verifikasi tanda tangan (gate UI saja —
 * otorisasi data tetap di API). Pola sama dengan `apps/web/proxy.ts`.
 */
export function isExpired(token: string): boolean {
  const payload = token.split(".")[1]
  if (!payload) return true
  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const json = JSON.parse(atob(padded)) as { exp?: unknown }
    if (typeof json.exp !== "number") return false
    return json.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}
