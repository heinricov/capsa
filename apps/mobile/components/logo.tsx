/// <reference types="react-native-css/types" />

import { APP_NAME } from "@workspace/constants"
import { cn } from "cn"
import { Text, View } from "react-native"

/** Logo mark versi native — web memakai SVG lucide yang tak bisa di RN. */
export function Logo({ className }: { className?: string }) {
  return (
    <View className={cn("flex-row items-center gap-2 self-center", className)}>
      <View className="size-6 items-center justify-center rounded-md bg-primary">
        <Text className="text-xs font-semibold text-primary-foreground">
          {APP_NAME.charAt(0)}
        </Text>
      </View>
      <Text className="font-medium text-foreground">{APP_NAME}</Text>
    </View>
  )
}
