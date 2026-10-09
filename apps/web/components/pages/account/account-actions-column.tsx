"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { api } from "@workspace/client"
import type { PublicAccount } from "@workspace/client/account"
import { Button } from "@workspace/web/web/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/web/web/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/web/web/dropdown-menu"
import { features } from "@/components/table/table-features"

function ActionsCell({
  account,
  onDeleted,
}: {
  account: PublicAccount
  onDeleted: () => void
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const detailUrl = `/dashboard/data/account/${account.id}`

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      await api.account.delete(account.id)
      setOpen(false)
      toast.success("Akun berhasil dihapus")
      onDeleted()
    } catch (err: unknown) {
      setOpen(false)
      toast.error(err instanceof Error ? err.message : "Gagal menghapus akun")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button className="h-8 w-8 p-0" variant="ghost" />}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(account.id)}
          >
            Copy account ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(detailUrl)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`${detailUrl}/edit`)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus akun?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun {account.name} ({account.email}) akan dihapus permanen dan
              tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Menghapus…" : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function makeAccountActionsColumn({
  onDeleted,
}: {
  onDeleted: () => void
}): ColumnDef<typeof features, PublicAccount> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <ActionsCell account={row.original} onDeleted={onDeleted} />
    ),
  }
}
