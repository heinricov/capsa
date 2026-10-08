"use client"

import * as React from "react"

import { api } from "@workspace/client"
import type { PublicBox } from "@workspace/client/box"
import { makeBoxColumns } from "@/components/pages/box/box-columns"
import { DataTable } from "@/components/table/data-table"

export function BoxTable() {
  const [rows, setRows] = React.useState<PublicBox[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    try {
      const page = await api.box.list({ limit: 100 })
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
    () => makeBoxColumns({ onDeleted: load }),
    [load]
  )

  if (loading) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Loading boxes…
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10 text-center text-destructive">
        Gagal memuat box: {error}
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={rows}
      filterColumnId="no"
      searchPlaceholder="Filter nomor box..."
      ToolbarActionLabel="New Box"
      ToolbarActionUrl="/dashboard/data/box/add"
    />
  )
}
