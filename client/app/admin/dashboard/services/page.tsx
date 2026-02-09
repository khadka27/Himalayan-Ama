"use client"

import { ServicesSection } from "@/components/admin/services-section"

export default function AdminServicesPage() {
    return (
        <div className="flex flex-col bg-slate-50 min-h-screen">
            <div className="flex-1 p-8">
                <ServicesSection />
            </div>
        </div>
    )
}
