import React from "react"
import { Field, FieldError, FieldLabel } from "@workspace/ui/web/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/web/select"

export function FieldSelect({
  id,
  label,
  placeholder,
  ItemsSelect,
  value,
  onValueChange,
  error,
  required,
  disabled,
}: {
  id: string
  label?: string
  placeholder?: string
  ItemsSelect: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
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
      <Select
        value={value}
        onValueChange={(newValue) => onValueChange?.(String(newValue))}
        required={required}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-invalid={error ? true : undefined}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {ItemsSelect.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
