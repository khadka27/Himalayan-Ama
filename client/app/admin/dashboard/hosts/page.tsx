"use client"

import { HostsSection } from "@/components/admin/hosts-section"

export default function AdminHostsPage() {
    return (
        <div className="flex flex-col bg-slate-50 min-h-screen">
            <div className="flex-1 p-8">
                <HostsSection />
            </div>
        </div>
    )
}
