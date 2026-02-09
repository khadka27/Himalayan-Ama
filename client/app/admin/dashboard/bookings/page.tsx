"use client"

import { Bookings as BookingsSection } from "@/components/admin/bookings-section"

export default function BookingsPage() {
  return (
    <div className="flex flex-col bg-sage-50 min-h-screen">
      <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-sage-900">Bookings</h1>
        <p className="text-sage-600 mt-1">Manage class bookings</p>
      </div>
      <div className="flex-1 p-8">
        <BookingsSection />
      </div>
    </div>
  )
}
