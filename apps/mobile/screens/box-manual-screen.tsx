import * as React from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import { api } from "@workspace/client"
import { AppError } from "@workspace/errors"
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
import { useAuth } from "../context/auth"
import { BackButton } from "../components/back-button"

export function BoxManualScreen({ onBack }: { onBack: () => void }) {
  const { account } = useAuth()
  const [no, setNo] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [noError, setNoError] = React.useState<string | null>(null)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  async function handleSave() {
    if (saving || !account) return
    const trimmed = no.trim()
    if (!trimmed) {
      setNoError("Nomor box wajib diisi")
      return
    }
    setNoError(null)
    setFormError(null)
    const controller = new AbortController()
    abortRef.current = controller
    setSaving(true)
    try {
      await api.box.create(
        {
          userId: account.id,
          no: trimmed,
          description: description.trim() || undefined,
        },
        { signal: controller.signal }
      )
      onBack()
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      if (err instanceof AppError && err.statusCode === 409) {
        setFormError("Nomor box sudah dipakai")
      } else if (err instanceof Error && err.message) {
        setFormError(err.message)
      } else {
        setFormError("Gagal menyimpan box. Coba lagi.")
      }
    } finally {
      abortRef.current = null
      setSaving(false)
    }
  }

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Card style={styles.card} className="rounded-lg">
            <View style={styles.fields}>
              {formError ? (
                <Text size="xs" className="text-destructive">
                  {formError}
                </Text>
              ) : null}
              <FormControl isInvalid={Boolean(noError)}>
                <FormControlLabel>
                  <FormControlLabelText className="text-xs">
                    Nomor box
                    <Text className="text-destructive"> *</Text>
                  </FormControlLabelText>
                </FormControlLabel>
                <Input className="h-10">
                  <InputField
                    accessibilityLabel="Nomor box"
                    placeholder="cth. B-001"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    value={no}
                    onChangeText={(value) => {
                      setNo(value)
                      setNoError(null)
                    }}
                  />
                </Input>
                {noError ? (
                  <FormControlError>
                    <FormControlErrorText>{noError}</FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText className="text-xs">
                    Deskripsi (opsional)
                  </FormControlLabelText>
                </FormControlLabel>
                <Input className="h-24">
                  <InputField
                    accessibilityLabel="Deskripsi"
                    placeholder="Catatan singkat tentang box ini"
                    multiline
                    textAlignVertical="top"
                    value={description}
                    onChangeText={setDescription}
                  />
                </Input>
              </FormControl>
            </View>
          </Card>

          <View style={styles.actions}>
            <Button
              size="lg"
              className="h-11 w-full"
              disabled={saving}
              onPress={() => void handleSave()}
            >
              <ButtonText>{saving ? "Menyimpan…" : "Simpan"}</ButtonText>
            </Button>
            <BackButton onPress={onBack} label="Batal" disabled={saving} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  card: {
    padding: 16,
  },
  fields: {
    gap: 16,
  },
  actions: {
    gap: 12,
  },
})
