import { AUTH_COOKIE_NAME } from "@workspace/constants"
import { NextRequest, NextResponse } from "next/server"

/**
 * Cek kedaluwarsa JWT tanpa verifikasi tanda tangan (gate UI saja —
 * otorisasi data tetap di API).
 */
function isExpired(token: string): boolean {
  const payload = token.split(".")[1]
  if (!payload) return true
  try {
    const json = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { exp?: unknown }
    if (typeof json.exp !== "number") return false
    return json.exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  if (!token || isExpired(token)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.search = `?next=${encodeURIComponent(
      request.nextUrl.pathname + request.nextUrl.search
    )}`
    const response = NextResponse.redirect(loginUrl)
    if (token) response.cookies.delete(AUTH_COOKIE_NAME)
    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
