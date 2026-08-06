import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import { Almarai, Archivo_Black, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const almarai = Almarai({
  subsets: ["latin"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
})

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
        almarai.variable,
        archivoBlack.variable
      )}
    >
      <body
        suppressHydrationWarning
        style={{
          fontFamily:
            "'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
        }}
      >
        <ClerkProvider appearance={{ theme: shadcn }}
        taskUrls={{"choose-organization":"/choose-organization"}}
        >
          <ThemeProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
