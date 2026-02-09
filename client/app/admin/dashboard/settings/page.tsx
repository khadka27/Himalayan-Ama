"use client"
import { SettingsSection } from "@/components/admin/settings-section"

export default function SettingsPage() {
  return (
    <div className="flex flex-col bg-sage-50 min-h-screen">
      <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-sage-900">Settings</h1>
        <p className="text-sage-600 mt-1">Manage your account settings</p>
      </div>
      <div className="flex-1 p-8">
        {/* Removed the title from SettingsSection and centered content */}
        <SettingsSection />
      </div>
    </div>
  )
}