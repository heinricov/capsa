"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@workspace/ui/web/button"
import type { PublicAccount } from "@workspace/client/account"
import { makeSelectColumn } from "@/components/table/data-table-select-column"
import { features } from "@/components/table/table-features"
import { accountActionsColumn } from "@/components/pages/account/account-actions-column"

export const accountColumns: ColumnDef<typeof features, PublicAccount>[] = [
  makeSelectColumn<PublicAccount>(),
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{String(row.getValue("id"))}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          variant="ghost"
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{String(row.getValue("email"))}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">{String(row.getValue("name"))}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone
      return <div className="capitalize">{phone ?? "—"}</div>
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="capitalize">{String(row.getValue("role"))}</div>
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

  accountActionsColumn,
]
