import { Metadata } from 'next'
import TermsPageClient from './terms-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Terms of Use | Himalayan Ama - Lakeside Pokhara",
    description: "Read the official Terms of Use for Himalayan Ama self-catering 1BHK apartment in Lakeside, Pokhara. Understand our booking, cancellation, guest transfer, and house rules.",
    alternates: {
        canonical: "https://himalayanama.com/terms",
    },
    openGraph: {
        title: "Terms of Use | Himalayan Ama - Lakeside Pokhara",
        description: "Official terms and conditions for booking and staying at Himalayan Ama private apartment near Phewa Lake, Pokhara.",
        url: "https://himalayanama.com/terms",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Terms of Use" }],
        type: "website"
    }
}

export default function TermsPage() {
    const termsSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms of Use – Himalayan Ama",
        "url": `${SITE_URL}/terms`,
        "description": "Terms of use and booking agreement for Himalayan Ama self-catering 1BHK apartment in Lakeside, Pokhara."
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Terms of Use", item: "/terms" }
    ])

    return (
        <>
            <JsonLd data={termsSchema} />
            <JsonLd data={breadcrumbSchema} />
            <TermsPageClient />
        </>
    )
}
