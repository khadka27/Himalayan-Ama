"use client"
import { Users as UsersSection } from "@/components/admin/user-section"

export default function UsersPage() {
  return (
    <div className="flex flex-col bg-sage-50 min-h-screen">
      <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-sage-900">Users</h1>
        <p className="text-sage-600 mt-1">Manage your members</p>
      </div>
      <div className="flex-1 p-8">
        <UsersSection />
      </div>
    </div>
  )
}
