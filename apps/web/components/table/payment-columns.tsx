"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@workspace/ui/web/button"
import { makeSelectColumn } from "@/components/table/data-table-select-column"
import { paymentActionsColumn } from "@/components/table/payment-actions-column"
import type { Payment } from "@/components/table/payments"
import { features } from "@/components/table/table-features"

export const paymentColumns: ColumnDef<typeof features, Payment>[] = [
  makeSelectColumn<Payment>(),
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{String(row.getValue("status"))}</div>
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
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  paymentActionsColumn,
]
