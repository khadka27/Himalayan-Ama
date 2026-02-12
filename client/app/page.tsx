import { Metadata } from 'next'
import HomePage from './home-client'

export const metadata: Metadata = {
    title: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
    description: "Experience premium living at Himalayan Ama. We offer luxury apartment rentals in the heart of Pokhara Waterfall, providing comfort, style, and authentic Nepalese hospitality.",
    alternates: {
        canonical: "https://himalayanama.com",
    },
}

export default function Page() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": "Himalayan Ama",
        "description": "Luxury apartment rentals in the heart of Pokhara Waterfall, Nepal.",
        "url": "https://himalayanama.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Pokhara",
            "addressRegion": "Kaski",
            "addressCountry": "NP"
        },
        "telephone": "+977-9816685279",
        "priceRange": "NPR",
        "image": "https://himalayanama.com/og-image.jpg"
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomePage />
        </>
    )
}
