import * as React from "react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { GluestackUIProvider } from "@workspace/mobile/provider"

import { AddBoxDialog } from "./components/add-box-dialog"
import type { AddBoxMode } from "./components/add-box-dialog"
import { Navbar } from "./components/navbar"
import { NavDock } from "./components/navdock"
import { AuthProvider, useAuth } from "./context/auth"
import { BoxManualScreen } from "./screens/box-manual-screen"
import { BoxScanScreen } from "./screens/box-scan-screen"
import { HomeScreen } from "./screens/home-screen"
import { LoginScreen } from "./screens/login-screen"
import { ProfileScreen } from "./screens/profile-screen"

import "./global.css"

type Route = "home" | "profile" | "box-manual" | "box-scan"

function Root() {
  const { status } = useAuth()
  const [route, setRoute] = React.useState<Route>("home")
  const [addOpen, setAddOpen] = React.useState(false)

  React.useEffect(() => {
    if (status !== "authed") {
      setRoute("home")
      setAddOpen(false)
    }
  }, [status])

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

  const isRootScreen = route === "home" || route === "profile"

  function navigateToInput(mode: AddBoxMode) {
    setAddOpen(false)
    setRoute(mode === "manual" ? "box-manual" : "box-scan")
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar onSettings={() => setRoute("profile")} />
      <View style={styles.screen}>
        {route === "home" ? (
          <HomeScreen />
        ) : route === "profile" ? (
          <ProfileScreen />
        ) : route === "box-manual" ? (
          <BoxManualScreen onBack={() => setRoute("home")} />
        ) : (
          <BoxScanScreen onBack={() => setRoute("home")} />
        )}
      </View>
      {isRootScreen ? (
        <NavDock
          active={route === "home" ? "home" : "profile"}
          onHome={() => setRoute("home")}
          onProfile={() => setRoute("profile")}
          onBox={() => setAddOpen(true)}
        />
      ) : null}
      <AddBoxDialog
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        onNavigateToInput={navigateToInput}
      />
    </SafeAreaView>
  )
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
  screen: {
    flex: 1,
  },
})
