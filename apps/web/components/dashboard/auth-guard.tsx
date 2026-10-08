"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@workspace/client"
import type { PublicAccount } from "@workspace/client/account"
import { AppError } from "@workspace/errors"
import { clearToken, getToken } from "@/lib/auth"
import { AuthProvider } from "@/components/dashboard/auth-context"

function loginUrl(): string {
  const next = window.location.pathname + window.location.search
  return `/login?next=${encodeURIComponent(next)}`
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [account, setAccount] = useState<PublicAccount | null>(null)

  useEffect(() => {
    let active = true
    const token = getToken()
    if (!token) {
      router.replace(loginUrl())
      return
    }
    api.setToken(token)
    api.auth
      .getProfile()
      .then((profile) => {
        if (active) setAccount(profile)
      })
      .catch((err) => {
        if (err instanceof AppError && err.statusCode === 401) {
          clearToken()
          api.clearToken()
          router.replace(loginUrl())
        }
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [router])

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted text-sm text-muted-foreground">
        Memuat…
      </div>
    )
  }
  return <AuthProvider initialAccount={account}>{children}</AuthProvider>
}
