import { Metadata } from 'next'
import ApartmentsListingPage from './apartments-listing-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Luxury Apartments | Explore Our Residences",
    description: "Browse our collection of luxury apartments in Pokhara. Find the perfect residence for your short or long stay at Himalayan Ama.",
    alternates: {
        canonical: "https://himalayanama.com/apartments",
    },
    openGraph: {
        title: "Luxury Apartments Portfolio | Himalayan Ama Pokhara",
        description: "Explore premium 1-bedroom, 2-bedroom, and penthouse luxury apartments in Pokhara Waterfall.",
        url: "https://himalayanama.com/apartments",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Luxury Apartments Pokhara" }],
        type: "website"
    }
}

export default function Page() {
    const apartmentsCatalogSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Luxury Apartment Portfolio",
        "url": `${SITE_URL}/apartments`,
        "description": "Browse our curated selection of luxury apartments in Pokhara."
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Apartments", item: "/apartments" }
    ])

    return (
        <>
            <JsonLd data={apartmentsCatalogSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ApartmentsListingPage />
        </>
    )
}
