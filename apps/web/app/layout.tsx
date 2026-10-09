import type { Metadata } from "next"
import { Geist, Geist_Mono, Oxanium } from "next/font/google"
import favicon from "@workspace/public/favicon.png"

import "@workspace/web/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@workspace/web/web/sonner"
import { cn } from "@workspace/web/utils"

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  icons: {
    icon: [{ url: favicon.src, type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        oxanium.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
