import { Metadata } from 'next'
import ServicesPage from './services-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Services & Amenities in Lakeside Pokhara | Himalayan Aama",
    description: "Discover self-catering 1BHK apartment services and amenities at Himalayan Aama, Lakeside Pokhara—including free yoga hall access, complimentary first-day meal, BBQ space, and maintenance support.",
    alternates: {
        canonical: "https://himalayanama.com/services",
    },
    openGraph: {
        title: "Services & Amenities in Lakeside Pokhara | Himalayan Aama",
        description: "Explore free yoga access, BBQ compound, complimentary first-day meal, self-catering kitchen, and maintenance services at Himalayan Aama.",
        url: "https://himalayanama.com/services",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Aama Services & Amenities" }],
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
