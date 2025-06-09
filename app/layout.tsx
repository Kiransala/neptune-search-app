import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Neptune Search - AI-Powered Local Services",
  description: "Find the best local service providers with AI-powered recommendations and Neptune Scoring.",
  keywords: "local services, AI search, service providers, Neptune, recommendations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} cz-shortcut-listen="true">{children}</body>
    </html>
  )
}
