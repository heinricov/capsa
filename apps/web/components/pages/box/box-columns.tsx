"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@workspace/ui/web/button"
import type { PublicBox } from "@workspace/client/box"
import { makeSelectColumn } from "@/components/table/data-table-select-column"
import { features } from "@/components/table/table-features"
import { makeBoxActionsColumn } from "@/components/pages/box/box-actions-column"

export function makeBoxColumns({
  onDeleted,
}: {
  onDeleted: () => void
}): ColumnDef<typeof features, PublicBox>[] {
  return [
    makeSelectColumn<PublicBox>(),
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <div className="capitalize">{String(row.getValue("id"))}</div>
      ),
    },
    {
      accessorKey: "userId",
      header: "User ID",
      cell: ({ row }) => (
        <div className="capitalize">{String(row.getValue("userId"))}</div>
      ),
    },
    {
      accessorKey: "no",
      header: ({ column }) => {
        return (
          <Button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            variant="ghost"
          >
            No
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase">{String(row.getValue("no"))}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="capitalize truncate max-w-xs">
          {row.getValue("description") ?? "—"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "CreatedAt",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.original.createdAt).toLocaleString("id-ID")}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "UpdatedAt",
      cell: ({ row }) => (
        <div className="capitalize">
          {new Date(row.original.updatedAt).toLocaleString("id-ID")}
        </div>
      ),
    },

    makeBoxActionsColumn({ onDeleted }),
  ]
}