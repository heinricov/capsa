import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { GluestackUIProvider } from "@workspace/mobile/provider"

import { AuthProvider, useAuth } from "./context/auth"
import { HomeScreen } from "./screens/home-screen"
import { LoginScreen } from "./screens/login-screen"

import "./global.css"

function Root() {
  const { status } = useAuth()

  if (status === "loading") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center bg-background">
          <Text className="text-sm text-muted-foreground">Memuat…</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (status === "guest") return <LoginScreen />
  return <HomeScreen />
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider>
        <StatusBar style="auto" />
        <AuthProvider>
          <Root />
        </AuthProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
})
