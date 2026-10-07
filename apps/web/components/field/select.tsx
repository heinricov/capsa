import React from "react"
import { Field, FieldLabel } from "@workspace/ui/web/field"
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
}: {
  id: string
  label?: string
  placeholder?: string
  ItemsSelect: { value: string; label: string }[]
}) {
  return (
    <Field>
      <FieldLabel htmlFor="checkout-7j9-exp-year-f59">{label}</FieldLabel>
      <Select>
        <SelectTrigger id={id}>
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
    </Field>
  )
}
