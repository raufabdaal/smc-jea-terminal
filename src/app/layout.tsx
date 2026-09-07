import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SMC · JEA · FX — Institutional Terminal",
  description: "$50,000-tier Institutional SMC/JEA FX Automated Execution & Decision Terminal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}
