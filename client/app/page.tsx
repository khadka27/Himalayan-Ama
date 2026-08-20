import { Metadata } from 'next'
import HomePage from './home-client'
import JsonLd from '@/components/seo/json-ld'
import { getLodgingBusinessSchema, getWebsiteSchema, getOrganizationSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
    description: "Experience premium living at Himalayan Ama. We offer luxury apartment rentals in the heart of Pokhara Waterfall, providing comfort, style, and authentic Nepalese hospitality.",
    alternates: {
        canonical: "https://himalayanama.com",
    },
    openGraph: {
        title: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
        description: "Experience premium living at Himalayan Ama. We offer luxury apartment rentals in the heart of Pokhara Waterfall.",
        url: "https://himalayanama.com",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Pokhara" }],
        type: "website"
    }
}

export default function Page() {
    const lodgingSchema = getLodgingBusinessSchema()
    const websiteSchema = getWebsiteSchema()
    const orgSchema = getOrganizationSchema()

    return (
        <>
            <JsonLd data={lodgingSchema} />
            <JsonLd data={websiteSchema} />
            <JsonLd data={orgSchema} />
            <HomePage />
        </>
    )
}

