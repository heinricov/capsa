/**
 * Deteksi IP LAN Mac terkini lalu tulis ke EXPO_PUBLIC_API_URL di .env.
 * Pakai: pnpm mobile:api-url   (jalankan sebelum `npx expo start -c`)
 */
import { networkInterfaces } from "node:os"
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const envPath = path.join(root, ".env")
const PORT = 4000

function detectIp() {
  const candidates = []
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        candidates.push({ name, address: addr.address })
      }
    }
  }
  if (candidates.length === 0) return null
  // Utamakan antarmuka fisik (en0/en1 = Wi-Fi/Ethernet); abaikan utun/vpn
  // kalau masih ada pilihan fisik.
  const physical = candidates.filter((c) => /^en\d+$/.test(c.name))
  const pick = physical[0] ?? candidates[0]
  return pick
}

const picked = detectIp()
if (!picked) {
  console.error("Tidak ada IPv4 non-loopback terdeteksi — cek koneksi Wi-Fi.")
  process.exit(1)
}

const url = `http://${picked.address}:${PORT}`
const env = readFileSync(envPath, "utf8")
const updated = env.replace(
  /^EXPO_PUBLIC_API_URL=.*$/m,
  `EXPO_PUBLIC_API_URL="${url}"`
)
if (updated === env && !/^EXPO_PUBLIC_API_URL=/m.test(env)) {
  console.error("Baris EXPO_PUBLIC_API_URL tidak ditemukan di .env")
  process.exit(1)
}
writeFileSync(envPath, updated)
console.log(`EXPO_PUBLIC_API_URL = ${url}  (antarmuka ${picked.name})`)
console.log("Restart Metro dengan cache bersih: npx expo start -c")
