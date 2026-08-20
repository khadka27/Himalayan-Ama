import { Metadata } from 'next'
import DisclaimerPageClient from './disclaimer-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Disclaimer | Himalayan Ama",
    description: "Read the official legal disclaimer and terms of information for Himalayan Ama luxury apartment rentals in Pokhara.",
    alternates: {
        canonical: "https://himalayanama.com/disclaimer",
    },
    openGraph: {
        title: "Disclaimer | Himalayan Ama",
        description: "Official legal disclaimer and website information policy for Himalayan Ama.",
        url: "https://himalayanama.com/disclaimer",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Disclaimer" }],
        type: "website"
    }
}

export default function DisclaimerPage() {
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Disclaimer", item: "/disclaimer" }
    ])

    return (
        <>
            <JsonLd data={breadcrumbSchema} />
            <DisclaimerPageClient />
        </>
    )
}
