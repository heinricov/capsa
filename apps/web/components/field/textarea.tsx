import React from "react"
import { Field, FieldLabel } from "@workspace/ui/web/field"
import { Textarea } from "@workspace/ui/web/textarea"

export function FieldTextArea() {
  return (
    <Field>
      <FieldLabel htmlFor="checkout-7j9-optional-comments">Comments</FieldLabel>
      <Textarea
        id="checkout-7j9-optional-comments"
        placeholder="Add any additional comments"
        className="resize-none"
      />
    </Field>
  )
}
