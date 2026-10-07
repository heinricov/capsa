"use client"
import React from "react"
import {
  Field,
  FieldDescription,
  FieldError,
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
  onSubmit,
  submitLabel = "Submit",
  submitting = false,
  formError,
  hideSubmit = false,
}: {
  label?: string
  description?: string
  children: React.ReactNode
  UrlCancel?: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  submitLabel?: string
  submitting?: boolean
  formError?: string | null
  hideSubmit?: boolean
}) {
  const router = useRouter()
  return (
    <div className="w-full">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit?.(event)
        }}
      >
        <FieldGroup>
          <FieldSet>
            <FieldLegend>{label}</FieldLegend>
            <FieldDescription>{description}</FieldDescription>
            {formError && <FieldError>{formError}</FieldError>}
            <FieldGroup>{children}</FieldGroup>
          </FieldSet>
          <Field orientation="horizontal" className="flex justify-end gap-2">
            {!hideSubmit && (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving…" : submitLabel}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => UrlCancel && router.push(UrlCancel)}
            >
              {hideSubmit ? "Back" : "Cancel"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
