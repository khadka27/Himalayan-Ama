"use client"

import type React from "react"
import { AdminSidebar } from "@/components//admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 ml-64">{children}</div>
    </div>
  )
}
