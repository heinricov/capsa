import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"
import { BackButton } from "../components/back-button"

export function BoxScanScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Card style={styles.card} className="rounded-lg">
          <Text size="sm" className="text-center text-muted-foreground">
            Fitur scan belum tersedia. Screen ini akan menampilkan kamera untuk
            memindai QR box.
          </Text>
        </Card>

        <BackButton onPress={onBack} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
})
