import { FieldForm } from "@/components/field/field-form"
import { FieldInput } from "@/components/field/input"
import { FieldSelect } from "@/components/field/select"
import React from "react"

export function AccountForm() {
  return (
    <div>
      <FieldForm
        label="Add Account"
        description="Menambahkan Akun Baru (bisa user bisa admin)"
        UrlCancel="/dashboard/data/account/"
      >
        <FieldInput id="name" label="Name" placeholder="Name" type="text" />
        <FieldInput id="email" label="Email" placeholder="Email" type="email" />
        <FieldInput id="phone" label="Phone" placeholder="Phone" type="phone" />
        <FieldSelect
          id="role"
          label="Role"
          placeholder="Role"
          ItemsSelect={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
        />
        <FieldInput
          id="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
      </FieldForm>
    </div>
  )
}
