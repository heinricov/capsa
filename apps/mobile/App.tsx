import { Button } from "@workspace/ui/native/components/button"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, Text, View } from "react-native"

import "./global.css"

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 gap-6 bg-background px-6 py-10">
          <View className="gap-1">
            <Text className="text-2xl font-semibold text-foreground">
              Project ready!
            </Text>
            <Text className="text-sm text-muted-foreground">
              React Native + NativeWind sharing components from packages/ui.
            </Text>
          </View>

          <View className="gap-3">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                Button ({variant})
              </Button>
            ))}
          </View>

          <View className="gap-3">
            <Button size="xs">size xs</Button>
            <Button size="sm">size sm</Button>
            <Button size="default">size default</Button>
            <Button size="lg">size lg</Button>
            <Button disabled>disabled</Button>
          </View>

          <Text className="font-mono text-xs text-muted-foreground">
            Tokens are shared with the web app via packages/ui/tokens.css
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
})
