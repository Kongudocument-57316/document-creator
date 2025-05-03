import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <head>
        <title>தமிழ் ஆவண எழுத்தர் மேலாண்மை மென்பொருள்</title>
        <meta name="description" content="தமிழ் ஆவண எழுத்தர் மேலாண்மை மென்பொருள்" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
