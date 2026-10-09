import * as React from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Text } from "@workspace/mobile/text"

export type AddBoxMode = "manual" | "scan"

type AddBoxDialogProps = {
  visible: boolean
  onClose: () => void
  onNavigateToInput: (mode: AddBoxMode) => void
}

export function AddBoxDialog({
  visible,
  onClose,
  onNavigateToInput,
}: AddBoxDialogProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={() => undefined}>
          <View style={styles.dialogHeader}>
            <Text size="lg" className="font-semibold">
              Add Box
            </Text>
            <Text size="xs" className="text-muted-foreground">
              Pilih metode input box
            </Text>
          </View>
          <Button
            size="lg"
            className="h-11 w-full"
            onPress={() => onNavigateToInput("manual")}
          >
            <ButtonText>Manual</ButtonText>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-11 w-full"
            onPress={() => onNavigateToInput("scan")}
          >
            <ButtonText>Scan</ButtonText>
          </Button>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dialog: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e3e7e8",
    backgroundColor: "#ffffff",
  },
  dialogHeader: {
    gap: 4,
    marginBottom: 4,
  },
})
