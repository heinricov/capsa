import { DataTable } from "@/components/table/data-table"
import { paymentColumns } from "@/components/table/payment-columns"
import { payments } from "@/components/table/payments"
import React from "react"

export function AccountTable() {
  return (
    <>
      <DataTable
        columns={paymentColumns}
        data={payments}
        filterColumnId="email"
        searchPlaceholder="Filter emails..."
      />
    </>
  )
}
