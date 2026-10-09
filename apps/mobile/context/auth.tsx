import * as React from "react"
import { api } from "@workspace/client"
import type { PublicAccount } from "@workspace/client/account"
import { AppError } from "@workspace/errors"
import { clearToken, getToken, isExpired, setToken } from "../lib/auth-storage"

export type AuthStatus = "loading" | "guest" | "authed"

type AuthContextValue = {
  status: AuthStatus
  account: PublicAccount | null
  signIn: (token: string, account: PublicAccount) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading")
  const [account, setAccount] = React.useState<PublicAccount | null>(null)

  React.useEffect(() => {
    let active = true
    void (async () => {
      const token = await getToken()
      if (!active) return
      if (!token || isExpired(token)) {
        await clearToken()
        if (active) setStatus("guest")
        return
      }
      api.setToken(token)
      try {
        const profile = await api.auth.getProfile()
        if (!active) return
        setAccount(profile)
        setStatus("authed")
      } catch (err) {
        if (!active) return
        if (err instanceof AppError && err.statusCode === 401) {
          api.clearToken()
          await clearToken()
        }
        setStatus("guest")
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const signIn = React.useCallback(
    async (token: string, profile: PublicAccount) => {
      api.setToken(token)
      await setToken(token)
      setAccount(profile)
      setStatus("authed")
    },
    []
  )

  const signOut = React.useCallback(async () => {
    api.auth.logout()
    await clearToken()
    setAccount(null)
    setStatus("guest")
  }, [])

  const value = React.useMemo(
    () => ({ status, account, signIn, signOut }),
    [status, account, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider")
  return context
}
