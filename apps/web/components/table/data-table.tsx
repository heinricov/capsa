"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table"
import * as React from "react"

import { DataTablePagination } from "@/components/table/data-table-pagination"
import { DataTableToolbar } from "@/components/table/data-table-toolbar"
import { DataTableView } from "@/components/table/data-table-view"
import { features } from "@/components/table/table-features"

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[]
  data: TData[]
  filterColumnId?: string
  searchPlaceholder?: string
  ToolbarActionLabel?: string
  ToolbarActionUrl?: string
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  filterColumnId,
  searchPlaceholder = "Filter...",
  ToolbarActionLabel,
  ToolbarActionUrl,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<ColumnVisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useTable({
    features,
    columns,
    data,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full rounded-md border px-6">
      <DataTableToolbar
        filterColumnId={filterColumnId}
        searchPlaceholder={searchPlaceholder}
        table={table}
        ToolbarActionLabel={ToolbarActionLabel}
        ToolbarActionUrl={ToolbarActionUrl}
      />
      <DataTableView table={table} />
      <DataTablePagination table={table} />
    </div>
  )
}
