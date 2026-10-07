import React from "react"
import { Field, FieldError, FieldLabel } from "@workspace/ui/web/field"
import { Input } from "@workspace/ui/web/input"

export function FieldInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  required,
  disabled,
  autoComplete,
}: {
  id: string
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  autoComplete?: string
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Input
        id={id}
        name={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange && ((event) => onChange(event.target.value))}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
