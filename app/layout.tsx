import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rama Toys Center - Toko Mainan Online Terlengkap",
  description:
    "Temukan mainan berkualitas tinggi untuk anak-anak tercinta. Koleksi lengkap robot, boneka, lego, puzzle, dan mainan edukatif lainnya.",
  keywords: "mainan, toko mainan, mainan anak, robot, boneka, lego, puzzle, mainan edukatif",
  authors: [{ name: "Rama Toys Center" }],
  openGraph: {
    title: "Rama Toys Center - Toko Mainan Online Terlengkap",
    description: "Temukan mainan berkualitas tinggi untuk anak-anak tercinta",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
