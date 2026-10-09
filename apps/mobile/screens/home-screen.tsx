import * as React from "react"
import { View, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"
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

export function HomeScreen() {
  const { account, signOut } = useAuth()
  const [signingOut, setSigningOut] = React.useState(false)

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
    <SafeAreaView
      edges={["top", "bottom"]}
      style={styles.safeArea}
      className="bg-background"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text size="2xl" className="font-semibold">
            Home
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Sedang login sebagai
          </Text>
        </View>

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
          variant="outline"
          size="lg"
          className="h-11 w-full"
          disabled={signingOut}
          onPress={handleSignOut}
        >
          <ButtonText>Log out</ButtonText>
        </Button>
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
    paddingVertical: 40,
  },
  header: {
    gap: 4,
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
})
