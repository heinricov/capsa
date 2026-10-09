import React from "react"
import { Field, FieldError, FieldLabel } from "@workspace/web/web/field"
import { Textarea } from "@workspace/web/web/textarea"

export function FieldTextArea({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
}: {
  id: string
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Textarea
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        className="resize-none"
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
