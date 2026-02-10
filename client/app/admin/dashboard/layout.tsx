"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Menu } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-sage-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Toggle */}
        <header className="md:hidden bg-white border-b border-sage-200 p-4 flex items-center shrink-0 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-sage-600 hover:bg-sage-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="ml-4 font-serif font-bold text-sage-900">Admin Panel</span>
        </header>

        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
