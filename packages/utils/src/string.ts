/** Huruf pertama kapital, sisanya tidak diubah. `""` → `""`. */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Ubah menjadi slug URL-friendly: buang aksen, huruf kecil, non-alnum jadi
 * `-`, dan buang `-` di pinggir. `"  Café Au Lait!  "` → `"cafe-au-lait"`.
 */
export function slugify(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Pangkas agar panjang hasil (termasuk `"..."`) ≤ `length`.
 * Jika `str` sudah ≤ `length`, dikembalikan utuh. `length < 3` dipangkas
 * tanpa ellipsis agar kontrak panjang tetap terpenuhi.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  if (length < 3) return str.slice(0, Math.max(0, length))
  return str.slice(0, Math.max(0, length - 3)) + "..."
}
