"use client"

import { ReviewsSection } from "@/components/admin/reviews-section"

export default function ReviewsPage() {
  return (
    <div className="flex flex-col bg-sage-50 min-h-screen">
      <div className="bg-white border-b border-sage-200 px-8 py-6 shadow-sm">
        <h1 className="text-3xl font-serif font-bold text-sage-900">Reviews</h1>
        <p className="text-sage-600 mt-1">Manage and moderate member reviews and testimonials</p>
      </div>
      <div className="flex-1 p-8">
        <ReviewsSection />
      </div>
    </div>
  )
}
