import { ClerkProvider } from "@clerk/nextjs"
import { shadcn } from "@clerk/ui/themes"
import type { Metadata, Viewport } from "next"
import { Almarai, Archivo_Black, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const SITE_URL = "https://auto-browse-seven.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AutoBrowse — AI Browser Automation",
    template: "%s | AutoBrowse",
  },
  description:
    "Build and run AI-powered browser automation workflows on a visual canvas. Compose open, act, extract, observe, and agent steps, then run them live in a real cloud browser powered by Stagehand.",
  applicationName: "AutoBrowse",
  keywords: [
    "browser automation",
    "AI agents",
    "web scraping",
    "workflow automation",
    "no-code automation",
    "visual workflow builder",
    "Stagehand",
    "AutoBrowse",
  ],
  authors: [{ name: "Siddharth", url: "https://github.com/siddreddy07" }],
  creator: "Siddharth",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AutoBrowse",
    title: "AutoBrowse — AI Browser Automation",
    description:
      "Compose a graph of browser automation steps — open a URL, act, extract, observe, or run an autonomous agent — and execute it in a real cloud browser.",
    images: ["/assets/Thumbnail.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoBrowse — AI Browser Automation",
    description:
      "Compose a graph of browser automation steps — open a URL, act, extract, observe, or run an autonomous agent — and execute it in a real cloud browser.",
    images: ["/assets/Thumbnail.png"],
  },
  icons: {
    icon: "/assets/auto_browse_fav-removebg-preview.png",
    shortcut: "/assets/auto_browse_fav-removebg-preview.png",
    apple: "/assets/auto_browse_fav-removebg-preview.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
}

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
