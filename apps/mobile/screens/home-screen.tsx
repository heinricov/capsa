import * as React from "react"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Box } from "@workspace/mobile/box"
import { Button, ButtonText } from "@workspace/mobile/button"
import { Card } from "@workspace/mobile/card"
import { Text } from "@workspace/mobile/text"
import { useAuth } from "../context/auth"

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
  return date.toLocaleString()
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
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-1 gap-6 px-6 py-10">
        <View className="gap-1">
          <Text size="2xl" className="font-semibold">
            Home
          </Text>
          <Text size="sm" className="text-muted-foreground">
            Sedang login sebagai
          </Text>
        </View>

        <Card>
          <Box className="flex-row items-center gap-3">
            <View className="size-10 items-center justify-center rounded-full bg-primary">
              <Text size="xs" className="font-medium text-primary-foreground">
                {initials(account.name)}
              </Text>
            </View>
            <Box className="flex-1 gap-0.5">
              <Text size="sm" className="font-medium">
                {account.name}
              </Text>
              <Text size="xs" className="text-muted-foreground">
                {account.email}
              </Text>
            </Box>
          </Box>
          <View className="gap-2 border-t border-border pt-3">
            {rows.map(([label, value]) => (
              <View
                key={label}
                className="flex-row items-start justify-between gap-3"
              >
                <Text size="xs" className="text-muted-foreground">
                  {label}
                </Text>
                <Text
                  size="xs"
                  className="flex-1 text-right text-foreground"
                  numberOfLines={1}
                >
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
