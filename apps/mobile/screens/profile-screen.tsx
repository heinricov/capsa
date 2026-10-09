import * as React from "react"
import { Modal, Pressable, StyleSheet, View } from "react-native"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"
import { BackButton } from "../components/back-button"
import { useAuth } from "../context/auth"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]
  if (!first) return "?"
  const last = parts[parts.length - 1]
  if (!last || first === last) return first.slice(0, 2).toUpperCase()
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}

function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return "—"
  const pad = (n: number): string => String(n).padStart(2, "0")
  return `${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${pad(date.getHours())}.${pad(date.getMinutes())}`
}

export function ProfileScreen() {
  const { account, signOut } = useAuth()
  const [signingOut, setSigningOut] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  if (!account) return null

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  const rows: Array<[string, string]> = [
    ["ID", account.id],
    ["Email", account.email],
    ["Role", account.role],
    ["Phone", account.phone ?? "—"],
    ["Created", formatDate(account.createdAt)],
  ]

  return (
    <View style={styles.content}>
      <Card style={styles.card} className="rounded-lg">
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text size="xs" className="font-medium text-primary-foreground">
              {initials(account.name)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text size="sm" className="font-medium">
              {account.name}
            </Text>
            <Text size="xs" className="text-muted-foreground">
              {account.email}
            </Text>
          </View>
        </View>
        <View style={styles.details}>
          {rows.map(([label, value]) => (
            <View key={label} style={styles.row}>
              <Text size="xs" className="text-muted-foreground">
                {label}
              </Text>
              <Text size="xs" className="flex-1 text-right text-foreground">
                {value}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Button
        variant="destructive"
        size="lg"
        className="h-11 w-full"
        style={styles.destructiveButton}
        disabled={signingOut}
        onPress={() => setConfirmOpen(true)}
      >
        <ButtonText style={styles.destructiveButtonText}>Log out</ButtonText>
      </Button>

      <Modal
        transparent
        visible={confirmOpen}
        animationType="fade"
        onRequestClose={() => setConfirmOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setConfirmOpen(false)}>
          <Pressable style={styles.dialog} onPress={() => undefined}>
            <View style={styles.dialogHeader}>
              <Text size="lg" className="font-semibold">
                Log out?
              </Text>
              <Text size="sm" className="text-muted-foreground">
                Kamu yakin ingin keluar dari akun ini?
              </Text>
            </View>
            <Button
              variant="destructive"
              size="lg"
              className="h-11 w-full"
              style={styles.destructiveButton}
              disabled={signingOut}
              onPress={() => {
                setConfirmOpen(false)
                void handleSignOut()
              }}
            >
              <ButtonText style={styles.destructiveButtonText}>
                {signingOut ? "Logging out…" : "Log out"}
              </ButtonText>
            </Button>
            <BackButton
              label="Batal"
              disabled={signingOut}
              onPress={() => setConfirmOpen(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    gap: 16,
    padding: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  details: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e3e7e8",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  destructiveButton: {
    backgroundColor: "#e7000b",
    borderWidth: 1,
    borderColor: "#e7000b",
  },
  destructiveButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
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
})
