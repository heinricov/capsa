"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@workspace/ui/web/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/web/dropdown-menu"
import type { PublicAccount } from "@workspace/client/account"
import { features } from "@/components/table/table-features"

export const accountActionsColumn: ColumnDef<typeof features, PublicAccount> = {
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const account = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button className="h-8 w-8 p-0" variant="ghost" />}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(account.id)}
          >
            Copy account ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
}
