import * as React from "react"
import { Image, Pressable, StyleSheet, View } from "react-native"
import { APP_NAME } from "@workspace/constants"
import { Text } from "@workspace/mobile/text"
import { IoSettingsOutline } from "./icons"

type NavbarProps = {
  onSettings: () => void
}

export function Navbar({ onSettings }: NavbarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <Image
          source={require("@workspace/public/icon.png")}
          style={styles.brandIcon}
          accessibilityLabel={`${APP_NAME} icon`}
        />
        <Text size="md" className="font-semibold">
          {APP_NAME}
        </Text>
      </View>

      <View style={styles.spacer} />

      <Pressable
        style={styles.settingsButton}
        onPress={onSettings}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <IoSettingsOutline size={22} color="#0f172a" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 56,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e3e7e8",
    backgroundColor: "#ffffff",
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 7,
  },
  spacer: {
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
})
