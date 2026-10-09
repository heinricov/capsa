import * as React from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { api } from "@workspace/client"
import type { PublicBox } from "@workspace/client/box"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"
import { BackButton } from "../components/back-button"
import { Navbar } from "../components/navbar"

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; boxes: PublicBox[] }

export type AddBoxMode = "manual" | "scan"

const SKELETON_KEYS = ["1", "2", "3", "4", "5", "6"]

export function BoxScreen({
  onBack,
  onNavigateToInput,
}: {
  onBack: () => void
  onNavigateToInput: (mode: AddBoxMode) => void
}) {
  const [state, setState] = React.useState<LoadState>({ status: "loading" })
  const [addOpen, setAddOpen] = React.useState(false)
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
      <Navbar
        title="Box"
        subtitle="Daftar box kamu"
        right={
          <Button
            variant="outline"
            size="sm"
            style={styles.addIconButton}
            onPress={() => setAddOpen(true)}
          >
            <ButtonText style={styles.addIconButtonText}>Add Box</ButtonText>
          </Button>
        }
      />
      <View style={styles.content}>
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

      <View style={styles.footer}>
        <BackButton onPress={onBack} />
      </View>

      <Modal
        transparent
        visible={addOpen}
        animationType="fade"
        onRequestClose={() => setAddOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setAddOpen(false)}>
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
              onPress={() => {
                setAddOpen(false)
                onNavigateToInput("manual")
              }}
            >
              <ButtonText>Manual</ButtonText>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full"
              onPress={() => {
                setAddOpen(false)
                onNavigateToInput("scan")
              }}
            >
              <ButtonText>Scan</ButtonText>
            </Button>
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingTop: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "flex-start",
    gap: 12,
  },
  boxCard: {
    width: "47%",
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
    width: "47%",
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
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
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
  addIconButton: {
    height: 36,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#007595",
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
  addIconButtonText: {
    color: "#007595",
    fontSize: 13,
    fontWeight: "500",
  },
})
