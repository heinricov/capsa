import React from "react"
import { Field, FieldLabel } from "@workspace/ui/web/field"
import { Input } from "@workspace/ui/web/input"

export function FieldInput({
  id,
  label,
  type,
  placeholder,
}: {
  id: string
  label?: string
  type?: string
  placeholder?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor="checkout-7j9-card-name-43j">{label}</FieldLabel>
      <Input id={id} placeholder={placeholder} type={type} required />
    </Field>
  )
}
