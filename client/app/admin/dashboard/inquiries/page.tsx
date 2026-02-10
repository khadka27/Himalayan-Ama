"use client"

import { InquiriesSection } from "@/components/admin/inquiries-section"

export default function InquiriesPage() {
    return (
        <div className="flex flex-col bg-slate-50 min-h-screen">
            <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-5 md:py-7 shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-6 bg-blue-600 rounded-full" />
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900">Inquiries</h1>
                </div>
                <p className="text-slate-500 text-xs md:text-sm font-medium ml-5">View and manage customer inquiries and messages from the contact page</p>
            </div>
            <div className="flex-1 p-4 md:p-8 lg:p-10">
                <InquiriesSection />
            </div>
        </div>
    )
}
