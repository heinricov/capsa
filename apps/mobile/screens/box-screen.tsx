import * as React from "react"
import { StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@workspace/client"
import type { PublicBox } from "@workspace/client/box"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; boxes: PublicBox[] }

const SKELETON_KEYS = ["1", "2", "3", "4", "5", "6"]

export function BoxScreen({ onBack }: { onBack: () => void }) {
  const [state, setState] = React.useState<LoadState>({ status: "loading" })
  const abortRef = React.useRef<AbortController | null>(null)

  const load = React.useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setState({ status: "loading" })
    try {
      const res = await api.box.list(
        { limit: 100 },
        { signal: controller.signal }
      )
      setState({ status: "ready", boxes: res.data })
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return
      setState({
        status: "error",
        message:
          err instanceof Error && err.message
            ? err.message
            : "Gagal memuat box. Coba lagi.",
      })
    } finally {
      abortRef.current = null
    }
  }, [])

  React.useEffect(() => {
    void load()
    return () => {
      abortRef.current?.abort()
    }
  }, [load])

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      style={styles.safeArea}
      className="bg-background"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text size="2xl" className="font-semibold">
              Box
            </Text>
            <Text size="sm" className="text-muted-foreground">
              Daftar box kamu
            </Text>
          </View>
          <Button variant="outline" size="lg" className="h-11 w-full" disabled>
            <ButtonText>Add Box</ButtonText>
          </Button>
        </View>

        {state.status === "loading" ? (
          <View style={styles.grid}>
            {SKELETON_KEYS.map((key) => (
              <View key={key} style={styles.skeletonCard} />
            ))}
          </View>
        ) : state.status === "error" ? (
          <View style={styles.center}>
            <Text size="sm" className="text-center text-muted-foreground">
              {state.message}
            </Text>
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-8"
              onPress={() => void load()}
            >
              <ButtonText>Coba lagi</ButtonText>
            </Button>
          </View>
        ) : state.boxes.length === 0 ? (
          <View style={styles.center}>
            <Text size="sm" className="text-center text-muted-foreground">
              Belum ada box.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {state.boxes.map((box) => (
              <Card key={box.id} style={styles.boxCard} className="rounded-lg">
                <Text size="xl" style={styles.boxNo} className="font-semibold">
                  {box.no}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </View>

      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-full"
        onPress={onBack}
      >
        <ButtonText>Kembali</ButtonText>
      </Button>
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
    gap: 16,
  },
  headerText: {
    gap: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "flex-start",
    gap: 16,
  },
  boxCard: {
    width: "48%",
    minHeight: 104,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  boxNo: {
    textAlign: "center",
  },
  skeletonCard: {
    width: "48%",
    minHeight: 104,
    borderRadius: 12,
    backgroundColor: "#e3e7e8",
  },
  center: {
    flex: 1,
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
  },
})
