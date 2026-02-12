import { Metadata } from 'next'
import ServicesPage from './services-client'

export const metadata: Metadata = {
    title: "Our Services | Premium Amenities & Hospitality",
    description: "Browse the premium services and amenities offered at Himalayan Ama luxury apartments. From curated tours to in-house dining, we ensure a comfortable stay.",
    alternates: {
        canonical: "https://himalayanama.com/services",
    },
}

export default function Page() {
    return <ServicesPage />
}
