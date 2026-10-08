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
  submittingLabel = "Saving…",
  submitting = false,
  formError,
  hideSubmit = false,
  hideCancel = false,
  submitWidth = "auto",
  submitAlign = "end",
}: {
  label?: string
  description?: string
  children: React.ReactNode
  UrlCancel?: string
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  submitLabel?: string
  submittingLabel?: string
  submitting?: boolean
  formError?: string | null
  hideSubmit?: boolean
  hideCancel?: boolean
  submitWidth?: "auto" | "full"
  submitAlign?: "start" | "center" | "end"
}) {
  const router = useRouter()
  const justify =
    submitAlign === "start"
      ? "justify-start"
      : submitAlign === "center"
        ? "justify-center"
        : "justify-end"
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
            {label && <FieldLegend>{label}</FieldLegend>}
            {description && <FieldDescription>{description}</FieldDescription>}
            {formError && <FieldError>{formError}</FieldError>}
            <FieldGroup>{children}</FieldGroup>
          </FieldSet>
          {(!hideSubmit || !hideCancel) && (
            <Field orientation="horizontal" className={`flex gap-2 ${justify}`}>
              {!hideSubmit && (
                <Button
                  type="submit"
                  className={submitWidth === "full" ? "w-full" : undefined}
                  disabled={submitting}
                >
                  {submitting ? submittingLabel : submitLabel}
                </Button>
              )}
              {!hideCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => UrlCancel && router.push(UrlCancel)}
                >
                  {hideSubmit ? "Back" : "Cancel"}
                </Button>
              )}
            </Field>
          )}
        </FieldGroup>
      </form>
    </div>
  )
}
