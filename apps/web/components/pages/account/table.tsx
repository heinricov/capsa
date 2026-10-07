"use client"

import * as React from "react"

import { api } from "@workspace/client"
import type { PublicAccount } from "@workspace/client/account"
import { makeAccountColumns } from "@/components/pages/account/account-columns"
import { DataTable } from "@/components/table/data-table"

export function AccountTable() {
  const [rows, setRows] = React.useState<PublicAccount[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    try {
      const page = await api.account.list({ limit: 100 })
      setRows(page.data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    load()
  }, [load])

  const columns = React.useMemo(
    () => makeAccountColumns({ onDeleted: load }),
    [load]
  )

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
      columns={columns}
      data={rows}
      filterColumnId="email"
      searchPlaceholder="Filter emails..."
      ToolbarActionLabel="New Account"
      ToolbarActionUrl="/dashboard/data/account/add"
    />
  )
}
