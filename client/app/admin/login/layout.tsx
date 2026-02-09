import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login - Himalayan Yogii",
  description: "Admin login portal for Himalayan Yogii yoga studio management",
}

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
