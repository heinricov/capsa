"use client"

import { createContext, useContext, useState } from "react"
import type { PublicAccount } from "@workspace/client/account"

type AuthContextValue = {
  account: PublicAccount | null
  setAccount: (account: PublicAccount | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  initialAccount = null,
  children,
}: {
  initialAccount?: PublicAccount | null
  children: React.ReactNode
}) {
  const [account, setAccount] = useState<PublicAccount | null>(initialAccount)
  return (
    <AuthContext.Provider value={{ account, setAccount }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth harus dipakai di dalam AuthProvider")
  return context
}
