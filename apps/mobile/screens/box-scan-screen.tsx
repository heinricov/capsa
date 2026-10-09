import * as React from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"
import { BackButton } from "../components/back-button"

export function BoxScanScreen({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={styles.safeArea}
      className="bg-background"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text size="2xl" className="font-semibold">
            Input Box Scan
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Pindai QR untuk input box
          </Text>
        </View>

        <Card style={styles.card} className="rounded-lg">
          <Text size="sm" className="text-center text-muted-foreground">
            Fitur scan belum tersedia. Screen ini akan menampilkan kamera untuk
            memindai QR box.
          </Text>
        </Card>

        <BackButton onPress={onBack} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  header: {
    gap: 4,
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
})
