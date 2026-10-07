"use client"
import React from "react"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/web/field"
import { Button } from "@workspace/ui/web/button"
import { useRouter } from "next/navigation"

export function FieldForm({
  label,
  description,
  children,
  UrlCancel,
}: {
  label?: string
  description?: string
  children: React.ReactNode
  UrlCancel?: string
}) {
  const router = useRouter()
  return (
    <div className="w-full">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{label}</FieldLegend>
            <FieldDescription>{description}</FieldDescription>
            <FieldGroup>{children}</FieldGroup>
          </FieldSet>
          <Field orientation="horizontal" className="flex justify-end">
            <Button type="submit">Submit</Button>
            <Button onClick={() => UrlCancel && router.push(UrlCancel)}>
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
