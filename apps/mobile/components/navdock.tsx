import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { BiBox, FaUser, TiHome } from "./icons"

type NavDockProps = {
  active: "home" | "profile"
  onHome: () => void
  onProfile: () => void
  onBox: () => void
}

const ACTIVE_COLOR = "#007595"
const INACTIVE_COLOR = "#6b7280"

export function NavDock({ active, onHome, onProfile, onBox }: NavDockProps) {
  return (
    <View style={styles.dock}>
      <Pressable
        style={styles.item}
        onPress={onHome}
        accessibilityRole="button"
        accessibilityLabel="Home"
      >
        <TiHome
          size={26}
          color={active === "home" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={onProfile}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <FaUser
          size={24}
          color={active === "profile" ? ACTIVE_COLOR : INACTIVE_COLOR}
        />
      </Pressable>
      <Pressable
        style={styles.item}
        onPress={onBox}
        accessibilityRole="button"
        accessibilityLabel="Add box"
      >
        <BiBox size={24} color={INACTIVE_COLOR} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  dock: {
    flexDirection: "row",
    height: 56,
    borderTopWidth: 1,
    borderTopColor: "#e3e7e8",
    backgroundColor: "#ffffff",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
})
