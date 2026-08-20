import { Metadata } from 'next'
import ServicesPage from './services-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Our Services & Hospitality | Himalayan Ama",
    description: "Browse the premium services and amenities offered at Himalayan Ama luxury apartments. From curated tours to in-house dining, we ensure a comfortable stay.",
    alternates: {
        canonical: "https://himalayanama.com/services",
    },
    openGraph: {
        title: "Hospitality & Amenities | Himalayan Ama",
        description: "Explore the premium concierge services, mountain views, fully equipped kitchens, and bespoke hospitality at Himalayan Ama.",
        url: "https://himalayanama.com/services",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Services" }],
        type: "website"
    }
}

export default function Page() {
    const servicesSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "Luxury Accommodation & Concierge Hospitality",
        "provider": {
            "@type": "LodgingBusiness",
            "name": "Himalayan Ama",
            "url": SITE_URL
        },
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": "Pokhara, Nepal"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Residence & Concierge Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Luxury Apartment Rentals"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Airport Pickups & Local Transfers"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Customized Tour & Trekking Guidance"
                    }
                }
            ]
        }
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Services", item: "/services" }
    ])

    return (
        <>
            <JsonLd data={servicesSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ServicesPage />
        </>
    )
}
