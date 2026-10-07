"use client"

import type { RowData } from "@tanstack/react-table"
import { ChevronDown, Columns3, RefreshCcw, SearchIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@workspace/ui/web/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/web/dropdown-menu"
import { Input } from "@workspace/ui/web/input"
import type { DataTableInstance } from "@/components/table/table-features"
import { useRouter } from "next/navigation"

interface DataTableToolbarProps<TData extends RowData> {
  table: DataTableInstance<TData>
  filterColumnId?: string
  searchPlaceholder: string
  ToolbarActionLabel?: string
  ToolbarActionUrl?: string
}

export function DataTableToolbar<TData extends RowData>({
  table,
  filterColumnId,
  searchPlaceholder,
  ToolbarActionLabel,
  ToolbarActionUrl,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const filterColumn = filterColumnId
    ? table.getColumn(filterColumnId)
    : undefined

  return (
    <div className="flex items-center gap-2 py-4">
      {filterColumn ? (
        <Input
          className="max-w-sm"
          onChange={(event) => filterColumn.setFilterValue(event.target.value)}
          placeholder={searchPlaceholder}
          value={(filterColumn.getFilterValue() as string) ?? ""}
        />
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button className="ml-auto" variant="outline" />}
        >
          <Columns3 /> Columns <ChevronDown className="ml-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="relative">
            <Input
              className="pl-8"
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              placeholder="Search"
              value={searchQuery}
            />
            <SearchIcon className="absolute inset-y-0 left-2 my-auto h-4 w-4" />
          </div>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              if (
                searchQuery &&
                !column.id.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return null
              }

              return (
                <DropdownMenuCheckboxItem
                  checked={column.getIsVisible()}
                  className="capitalize"
                  key={column.id}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              table.resetColumnVisibility()
              setSearchQuery("")
            }}
          >
            <RefreshCcw /> Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        disabled={!ToolbarActionUrl}
        onClick={() => ToolbarActionUrl && router.push(ToolbarActionUrl)}
      >
        {ToolbarActionLabel}
      </Button>
    </div>
  )
}
