import React from "react"
import { Field, FieldLabel } from "@workspace/ui/web/field"
import { Input } from "@workspace/ui/web/input"

export function FieldInput() {
  return (
    <Field>
      <FieldLabel htmlFor="checkout-7j9-card-name-43j">Name on Card</FieldLabel>
      <Input
        id="checkout-7j9-card-name-43j"
        placeholder="Evil Rabbit"
        required
      />
    </Field>
  )
}
