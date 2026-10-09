import * as React from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@workspace/client"
import { loginSchema } from "@workspace/client/auth"
import { AppError } from "@workspace/errors"
import { Box } from "@workspace/mobile/box"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Card } from "@workspace/mobile/card"
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@workspace/mobile/form-control"
import { Input, InputField } from "@workspace/mobile/input"
import { Text } from "@workspace/mobile/text"
import { VStack } from "@workspace/mobile/vstack"
import { Logo } from "../components/logo"
import { useAuth } from "../context/auth"

type FieldErrors = { email?: string; password?: string }

export function LoginScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  function handleChange(key: keyof FieldErrors, value: string) {
    if (key === "email") setEmail(value)
    else setPassword(value)
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function handleSubmit() {
    if (submitting) return
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const next: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === "email") next.email = issue.message
        if (issue.path[0] === "password") next.password = issue.message
      }
      setErrors(next)
      return
    }

    setErrors({})
    setFormError(null)
    setSubmitting(true)
    try {
      const { token, account } = await api.auth.login(parsed.data)
      await signIn(token, account)
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
    <SafeAreaView
      edges={["top", "bottom"]}
      style={styles.safeArea}
      className="bg-muted"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Logo />
          <Card style={styles.card} className="rounded-lg">
            <Box className="items-center gap-1">
              <Text size="xl" className="font-medium">
                Welcome back
              </Text>
              <Text size="xs" className="leading-relaxed text-muted-foreground">
                Login with your email and password
              </Text>
            </Box>
            <VStack style={styles.fieldGroup}>
              {formError ? (
                <Text size="xs" className="text-destructive">
                  {formError}
                </Text>
              ) : null}
              <FormControl isInvalid={Boolean(errors.email)}>
                <FormControlLabel className="w-full">
                  <FormControlLabelText className="text-xs">
                    Email
                    <Text className="text-destructive"> *</Text>
                  </FormControlLabelText>
                </FormControlLabel>
                <Input className="h-10">
                  <InputField
                    accessibilityLabel="Email"
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    value={email}
                    onChangeText={(value) => handleChange("email", value)}
                  />
                </Input>
                {errors.email ? (
                  <FormControlError>
                    <FormControlErrorText>{errors.email}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              <FormControl isInvalid={Boolean(errors.password)}>
                <FormControlLabel className="w-full justify-between">
                  <FormControlLabelText className="text-xs">
                    Password
                    <Text className="text-destructive"> *</Text>
                  </FormControlLabelText>
                  <Text size="xs" className="text-muted-foreground">
                    Forgot your password?
                  </Text>
                </FormControlLabel>
                <Input className="h-10">
                  <InputField
                    accessibilityLabel="Password"
                    placeholder="••••••••"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password"
                    value={password}
                    onChangeText={(value) => handleChange("password", value)}
                  />
                </Input>
                {errors.password ? (
                  <FormControlError>
                    <FormControlErrorText>
                      {errors.password}
                    </FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              <Text size="xs" className="text-center text-muted-foreground">
                Don&apos;t have an account? Sign up
              </Text>
              <Button
                size="lg"
                className="h-11 w-full"
                disabled={submitting}
                onPress={handleSubmit}
              >
                <ButtonText>{submitting ? "Signing in…" : "Login"}</ButtonText>
              </Button>
            </VStack>
          </Card>
          <Text
            size="xs"
            style={styles.terms}
            className="text-center text-muted-foreground"
          >
            By clicking continue, you agree to our Terms of Service and Privacy
            Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    marginTop: 24,
    gap: 16,
  },
  fieldGroup: {
    width: "100%",
    gap: 16,
  },
  terms: {
    marginTop: 24,
  },
})
