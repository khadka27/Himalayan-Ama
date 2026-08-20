import { Metadata } from 'next'
import ContactPage from './contact-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Contact Us | Reserve Your Luxury Stay",
    description: "Have questions about our luxury apartments in Pokhara? Reach out to Himalayan Ama for inquiries, bookings, and concierge services.",
    alternates: {
        canonical: "https://himalayanama.com/contact",
    },
    openGraph: {
        title: "Contact Himalayan Ama | Luxury Accommodation Inquiries",
        description: "Get in touch with Himalayan Ama for bookings, concierge services, and apartment inquiries in Pokhara.",
        url: "https://himalayanama.com/contact",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact Himalayan Ama" }],
        type: "website"
    }
}

export default function Page() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Himalayan Ama",
        "url": `${SITE_URL}/contact`,
        "description": "Contact details and inquiry options for Himalayan Ama luxury apartments in Pokhara.",
        "mainEntity": {
            "@type": "ContactPoint",
            "telephone": "+977-9816685279",
            "email": "info@himalayanama.com",
            "contactType": "customer support",
            "availableLanguage": ["English", "Nepali"]
        }
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Contact", item: "/contact" }
    ])

    return (
        <>
            <JsonLd data={contactSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ContactPage />
        </>
    )
}
