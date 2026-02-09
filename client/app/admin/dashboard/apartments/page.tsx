"use client"

import { ApartmentsSection } from "@/components/admin/apartments-section"

export default function ApartmentsPage() {
  return (
    <div className="flex flex-col bg-sage-50 min-h-screen">
      <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-sage-900">Apartments</h1>
        <p className="text-sage-600 mt-1">Add and manage rental apartments</p>
      </div>
      <div className="flex-1 p-8">
        <ApartmentsSection />
      </div>
    </div>
  )
}
