"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { api } from "@workspace/client"
import type { PublicBox } from "@workspace/client/box"
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
  box,
  onDeleted,
}: {
  box: PublicBox
  onDeleted: () => void
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const detailUrl = `/dashboard/data/box/${box.id}`

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      await api.box.delete(box.id)
      setOpen(false)
      toast.success("Box berhasil dihapus")
      onDeleted()
    } catch (err: unknown) {
      setOpen(false)
      toast.error(err instanceof Error ? err.message : "Gagal menghapus box")
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
            onClick={() => navigator.clipboard.writeText(box.id)}
          >
            Copy box ID
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
            <AlertDialogTitle>Hapus box?</AlertDialogTitle>
            <AlertDialogDescription>
              Box {box.no} akan dihapus permanen dan tidak bisa dikembalikan.
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

export function makeBoxActionsColumn({
  onDeleted,
}: {
  onDeleted: () => void
}): ColumnDef<typeof features, PublicBox> {
  return {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell box={row.original} onDeleted={onDeleted} />,
  }
}
