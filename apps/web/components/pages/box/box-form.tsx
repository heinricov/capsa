"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { api } from "@workspace/client"
import { createBoxSchema } from "@workspace/client/box"
import { FieldForm } from "@/components/field/field-form"
import { FieldInput } from "@/components/field/input"
import { FieldTextArea } from "@/components/field/textarea"

type BoxFormMode = "create" | "view" | "edit"

const FIELD_KEYS = ["userId", "no", "description"] as const
type FieldKey = (typeof FIELD_KEYS)[number]
type FieldErrors = Partial<Record<FieldKey, string>>

const LIST_URL = "/dashboard/data/box"

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

interface BoxFormValues {
  userId: string
  no: string
  description: string
}

const EMPTY_VALUES: BoxFormValues = {
  userId: "",
  no: "",
  description: "",
}

export function BoxForm({ mode, id }: { mode: BoxFormMode; id?: string }) {
  const router = useRouter()
  const readOnly = mode === "view"

  const [values, setValues] = React.useState<BoxFormValues>(EMPTY_VALUES)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(mode !== "create")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (mode === "create" || !id) return
    let cancelled = false

    setLoading(true)
    api.box
      .get(id)
      .then((box) => {
        if (cancelled) return
        setValues({
          userId: box.userId,
          no: box.no,
          description: box.description ?? "",
        })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : "Gagal memuat box"
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
      userId: values.userId.trim(),
      no: values.no.trim(),
      description: values.description.trim(),
    }

    const payload: Record<string, unknown> = {
      userId: trimmed.userId,
      no: trimmed.no,
      description: trimmed.description || null,
    }

    if (mode === "create") {
      const parsed = createBoxSchema.safeParse(payload)
      if (!parsed.success) {
        setFieldErrors(fieldErrorsOf(parsed.error))
        return
      }
      await runSubmit(() => api.box.create(parsed.data), "Box berhasil dibuat")
      return
    }

    const editSchema = createBoxSchema.partial()
    const parsed = editSchema.safeParse(payload)
    if (!parsed.success) {
      setFieldErrors(fieldErrorsOf(parsed.error))
      return
    }
    await runSubmit(
      () => api.box.update(id ?? "", parsed.data),
      "Perubahan disimpan"
    )
  }

  const label =
    mode === "create" ? "Add Box" : mode === "edit" ? "Edit Box" : "Box Detail"
  const description =
    mode === "create"
      ? "Menambahkan Box Baru"
      : mode === "edit"
        ? "Perbarui data box"
        : "Data box (read-only)"
  const submitLabel = mode === "create" ? "Create Box" : "Save Changes"
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
          id="userId"
          label="User ID"
          placeholder="User ID (UUID)"
          type="text"
          autoComplete="off"
          value={values.userId}
          onChange={(value) => setValue("userId", value)}
          error={fieldErrors.userId}
          required
          disabled={disabled}
        />
        <FieldInput
          id="no"
          label="No"
          placeholder="Nomor Box"
          type="text"
          value={values.no}
          onChange={(value) => setValue("no", value)}
          error={fieldErrors.no}
          required
          disabled={disabled}
        />
        <FieldTextArea
          id="description"
          label="Description"
          placeholder="Deskripsi (opsional)"
          value={values.description}
          onChange={(value) => setValue("description", value)}
          error={fieldErrors.description}
          disabled={disabled}
        />
      </FieldForm>
    </div>
  )
}
