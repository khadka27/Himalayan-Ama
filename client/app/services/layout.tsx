import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Services & Amenities - Himalayan Ama",
    description: "Explore the premium amenities and services offered at Himalayan Ama apartments in Pokhara, including full kitchens, BBQ spaces, high-speed WiFi, and more.",
}

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
