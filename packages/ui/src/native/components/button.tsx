/// <reference types="react-native-css/types" />

import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ReactNode } from "react"
import { Pressable, Text, type PressableProps } from "react-native"
import { buttonVariants } from "../../lib/button-variants"

type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    className?: string
    /** Class name applied to the inner `Text` (wins over `className`). */
    textClassName?: string
    children?: ReactNode
  }

function Button({
  className,
  textClassName,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <Text
        className={cn(
          "text-xs/relaxed font-medium text-inherit",
          textClassName
        )}
      >
        {children}
      </Text>
    </Pressable>
  )
}

export { Button }
export type { ButtonProps }
