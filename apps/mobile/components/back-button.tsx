import * as React from "react"
import { StyleSheet } from "react-native"
import { Button, ButtonText } from "@workspace/mobile/button"

type BackButtonProps = {
  onPress: () => void
  label?: string
  disabled?: boolean
}

export function BackButton({
  onPress,
  label = "Kembali",
  disabled = false,
}: BackButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      style={styles.button}
      disabled={disabled}
      onPress={onPress}
    >
      <ButtonText style={styles.text}>{label}</ButtonText>
    </Button>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderColor: "#007595",
    backgroundColor: "#ffffff",
  },
  text: {
    color: "#007595",
    fontSize: 14,
    fontWeight: "500",
  },
})
