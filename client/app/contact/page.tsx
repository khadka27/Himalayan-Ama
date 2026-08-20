import { Metadata } from 'next'
import ContactPage from './contact-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Contact Himalayan Aama | Self-Catering 1BHK Apartment in Lakeside Pokhara",
    description: "Contact Himalayan Aama for booking inquiries, rates, and availability for our self-catering 1BHK apartment in Street No. 16, Lakeside, Pokhara near Phewa Lake.",
    alternates: {
        canonical: "https://himalayanama.com/contact",
    },
    openGraph: {
        title: "Contact Himalayan Aama | Lakeside Pokhara Apartment",
        description: "Reach out to Himalayan Aama for booking inquiries and information about our self-catering 1BHK apartment in Lakeside, Pokhara.",
        url: "https://himalayanama.com/contact",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact Himalayan Aama" }],
        type: "website"
    }
}

export default function Page() {
    const contactSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Himalayan Aama",
        "url": `${SITE_URL}/contact`,
        "description": "Contact details and booking inquiry options for Himalayan Aama self-catering 1BHK apartment in Lakeside, Pokhara.",
        "mainEntity": {
            "@type": "ContactPoint",
            "telephone": "+977-9816685279",
            "email": "info@himalayanAama.com",
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
