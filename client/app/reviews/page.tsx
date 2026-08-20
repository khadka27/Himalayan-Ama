import { Metadata } from 'next'
import ReviewsPageClient from './reviews-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Guest Reviews & Experiences | Himalayan Ama",
    description: "Read real stories and guest reviews from travelers who stayed at Himalayan Ama luxury apartments in Pokhara Waterfall, Nepal.",
    alternates: {
        canonical: "https://himalayanama.com/reviews",
    },
    openGraph: {
        title: "Guest Reviews & Experiences | Himalayan Ama",
        description: "Read authentic feedback from travelers who stayed at Himalayan Ama luxury residences in Pokhara.",
        url: "https://himalayanama.com/reviews",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Reviews" }],
        type: "website"
    }
}

export default function ReviewsPage() {
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Reviews", item: "/reviews" }
    ])

    return (
        <>
            <JsonLd data={breadcrumbSchema} />
            <ReviewsPageClient />
        </>
    )
}
