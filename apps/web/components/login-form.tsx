"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "@workspace/client"
import { loginSchema } from "@workspace/client/auth"
import { AppError } from "@workspace/errors"
import { toast } from "sonner"

import { cn } from "cn"

import { Button } from "@workspace/ui/web/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/web/card"
import {
  Field,
  FieldDescription,
  FieldSeparator,
} from "@workspace/ui/web/field"
import { FieldForm } from "@/components/field/field-form"
import { FieldInput } from "@/components/field/input"
import { getToken, setToken } from "@/lib/auth"

/** Hanya terima path internal (`/…`) — tolak `//evil.com` (open redirect). */
function safeNext(raw: string | null): string | null {
  if (!raw) return null
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : null
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get("next"))

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (getToken()) router.replace(next ?? "/dashboard")
  }, [router, next])

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const nextErrors: { email?: string; password?: string } = {}
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "email") nextErrors.email = issue.message
        if (issue.path[0] === "password") nextErrors.password = issue.message
      }
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setFormError(null)
    setSubmitting(true)
    try {
      const { token } = await api.auth.login(parsed.data)
      setToken(token)
      toast.success("Login berhasil")
      router.replace(next ?? "/dashboard")
    } catch (err) {
      if (err instanceof AppError && err.statusCode === 401) {
        setFormError("Email atau password salah")
      } else if (err instanceof Error && err.message) {
        setFormError(err.message)
      } else {
        setFormError("Login gagal. Coba lagi.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldForm
            onSubmit={handleLogin}
            submitLabel="Login"
            submittingLabel="Signing in…"
            submitting={submitting}
            formError={formError}
            submitWidth="full"
            hideCancel
          >
            <FieldInput
              id="email"
              label="Email"
              type="email"
              placeholder="m@example.com"
              required
              autoComplete="email"
              value={email}
              onChange={(value) => {
                setEmail(value)
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              error={errors.email}
            />
            <FieldInput
              id="password"
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              labelRight={
                <a
                  href="#"
                  className="text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              }
              value={password}
              onChange={(value) => {
                setPassword(value)
                setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              error={errors.password}
            />
          </FieldForm>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </FieldDescription>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
