import React from "react"
import { BoxForm } from "@/components/pages/box/box-form"

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <>
      <BoxForm mode="edit" id={id} />
    </>
  )
}
