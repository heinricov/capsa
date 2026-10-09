"use client"

import type { ColumnDef, RowData } from "@tanstack/react-table"

import { Checkbox } from "@workspace/web/web/checkbox"
import { features } from "@/components/table/table-features"

export function makeSelectColumn<TData extends RowData>(): ColumnDef<
  typeof features,
  TData
> {
  return {
    id: "select",
    header: ({ table }) => {
      const all = table.getIsAllPageRowsSelected()
      const some = table.getIsSomePageRowsSelected()

      return (
        <Checkbox
          aria-label="Select all"
          checked={all}
          indeterminate={some && !all}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      )
    },
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}
