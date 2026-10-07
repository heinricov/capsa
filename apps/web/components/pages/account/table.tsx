"use client"

import * as React from "react"

import { api } from "@workspace/client"
import type { PublicAccount } from "@workspace/client/account"
import { accountColumns } from "@/components/pages/account/account-columns"
import { DataTable } from "@/components/table/data-table"

export function AccountTable() {
  const [rows, setRows] = React.useState<PublicAccount[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    api.account
      .list({ limit: 100 })
      .then((page) => {
        if (!cancelled) setRows(page.data)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Gagal memuat data")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Loading accounts…
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center text-destructive">
        Gagal memuat akun: {error}
      </div>
    )
  }

  return (
    <DataTable
      columns={accountColumns}
      data={rows}
      filterColumnId="email"
      searchPlaceholder="Filter emails..."
      ToolbarActionLabel="New Account"
      ToolbarActionUrl="/dashboard/data/account/add"
    />
  )
}
