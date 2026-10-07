"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ROLES } from "@workspace/constants"
import { api } from "@workspace/client"
import { createAccountSchema } from "@workspace/client/account"
import { FieldForm } from "@/components/field/field-form"
import { FieldInput } from "@/components/field/input"
import { FieldSelect } from "@/components/field/select"

type AccountFormMode = "create" | "view" | "edit"

const FIELD_KEYS = ["name", "email", "phone", "role", "password"] as const
type FieldKey = (typeof FIELD_KEYS)[number]
type FieldErrors = Partial<Record<FieldKey, string>>

const LIST_URL = "/dashboard/data/account"

const ROLE_ITEMS = [
  { value: ROLES.USER, label: "User" },
  { value: ROLES.ADMIN, label: "Admin" },
]

function isFieldKey(key: string): key is FieldKey {
  return (FIELD_KEYS as readonly string[]).includes(key)
}

function fieldErrorsOf(error: {
  issues: { path: unknown[]; message: string }[]
}): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "")
    if (isFieldKey(key) && !errors[key]) errors[key] = issue.message
  }
  return errors
}

function splitServerFieldError(
  message: string
): { key: FieldKey; message: string } | null {
  const separator = message.indexOf(":")
  if (separator === -1) return null
  const key = message.slice(0, separator).trim()
  if (!isFieldKey(key)) return null
  return { key, message: message.slice(separator + 1).trim() || message }
}

interface AccountFormValues {
  name: string
  email: string
  phone: string
  role: string
  password: string
}

const EMPTY_VALUES: AccountFormValues = {
  name: "",
  email: "",
  phone: "",
  role: ROLES.USER,
  password: "",
}

export function AccountForm({
  mode,
  id,
}: {
  mode: AccountFormMode
  id?: string
}) {
  const router = useRouter()
  const readOnly = mode === "view"

  const [values, setValues] = React.useState<AccountFormValues>(EMPTY_VALUES)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(mode !== "create")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (mode === "create" || !id) return
    let cancelled = false

    setLoading(true)
    api.account
      .get(id)
      .then((account) => {
        if (cancelled) return
        setValues({
          name: account.name,
          email: account.email,
          phone: account.phone ?? "",
          role: account.role,
          password: "",
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : "Gagal memuat akun"
        setFormError(message)
        toast.error(message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [mode, id])

  function setValue(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  async function runSubmit(
    execute: () => Promise<unknown>,
    successMessage: string
  ) {
    setSubmitting(true)
    try {
      await execute()
      toast.success(successMessage)
      router.push(LIST_URL)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan"
      const serverField = splitServerFieldError(message)
      if (serverField) {
        setFieldErrors({ [serverField.key]: serverField.message })
        return
      }
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmit() {
    if (loading || submitting) return
    setFieldErrors({})
    setFormError(null)

    const trimmed = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      role: values.role,
      password: values.password,
    }

    const payload: Record<string, unknown> = {
      name: trimmed.name,
      email: trimmed.email,
      phone: trimmed.phone ? trimmed.phone : null,
      role: trimmed.role,
    }
    if (trimmed.password) payload.password = trimmed.password

    if (mode === "create") {
      const parsed = createAccountSchema.safeParse(payload)
      if (!parsed.success) {
        setFieldErrors(fieldErrorsOf(parsed.error))
        return
      }
      await runSubmit(
        () => api.account.create(parsed.data),
        "Akun berhasil dibuat"
      )
      return
    }

    const editSchema = createAccountSchema.omit({ password: true })
    const schema = trimmed.password
      ? editSchema.extend({ password: createAccountSchema.shape.password })
      : editSchema
    const parsed = schema.safeParse(payload)
    if (!parsed.success) {
      setFieldErrors(fieldErrorsOf(parsed.error))
      return
    }
    await runSubmit(
      () => api.account.update(id ?? "", parsed.data),
      "Perubahan disimpan"
    )
  }

  const label =
    mode === "create"
      ? "Add Account"
      : mode === "edit"
        ? "Edit Account"
        : "Account Detail"
  const description =
    mode === "create"
      ? "Menambahkan Akun Baru (bisa user bisa admin)"
      : mode === "edit"
        ? "Perbarui data akun"
        : "Data akun (read-only)"
  const submitLabel = mode === "create" ? "Create Account" : "Save Changes"
  const disabled = readOnly || loading

  return (
    <div>
      <FieldForm
        label={label}
        description={description}
        UrlCancel={LIST_URL}
        onSubmit={handleSubmit}
        submitLabel={submitLabel}
        submitting={submitting}
        formError={formError}
        hideSubmit={readOnly}
      >
        <FieldInput
          id="name"
          label="Name"
          placeholder="Name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(value) => setValue("name", value)}
          error={fieldErrors.name}
          required
          disabled={disabled}
        />
        <FieldInput
          id="email"
          label="Email"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => setValue("email", value)}
          error={fieldErrors.email}
          required
          disabled={disabled}
        />
        <FieldInput
          id="phone"
          label="Phone"
          placeholder="Phone"
          type="tel"
          value={values.phone}
          onChange={(value) => setValue("phone", value)}
          error={fieldErrors.phone}
          disabled={disabled}
        />
        <FieldSelect
          id="role"
          label="Role"
          placeholder="Role"
          ItemsSelect={ROLE_ITEMS}
          value={values.role}
          onValueChange={(value) => setValue("role", value)}
          error={fieldErrors.role}
          disabled={disabled}
        />
        {!readOnly && (
          <FieldInput
            id="password"
            label="Password"
            placeholder={
              mode === "edit" ? "Kosongkan jika tidak diubah" : "Password"
            }
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(value) => setValue("password", value)}
            error={fieldErrors.password}
            required={mode === "create"}
            disabled={loading}
          />
        )}
      </FieldForm>
    </div>
  )
}
