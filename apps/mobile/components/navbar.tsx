import * as React from "react"
import { Image, StyleSheet, View } from "react-native"
import { APP_NAME } from "@workspace/constants"
import { Text } from "@workspace/mobile/text"

type NavbarProps = {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export function Navbar({ title, subtitle, right }: NavbarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.brandIcon}
          accessibilityLabel={`${APP_NAME} icon`}
        />
        <Text size="md" className="font-semibold">
          {APP_NAME}
        </Text>
      </View>

      {/* <View style={styles.titles}>
        <Text size="md" className="font-semibold" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text size="xs" style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View> */}

      <View style={styles.rightSlot}>{right}</View>
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
  titles: {
    flex: 1,
    alignItems: "center",
    gap: 1,
  },
  subtitle: {
    color: "#6b7280",
  },
  rightSlot: {
    alignItems: "flex-end",
    minWidth: 0,
  },
})
