import React from "react"
import { AccountForm } from "@/components/pages/account/account-form"

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <AccountForm mode="view" id={id} />
    </>
  )
}
