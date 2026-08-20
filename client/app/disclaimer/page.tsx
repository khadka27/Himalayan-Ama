import { Metadata } from 'next'
import DisclaimerPageClient from './disclaimer-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Disclaimer & Guest Information | Himalayan Aama - Lakeside Pokhara",
    description: "Read the official Disclaimer & Guest Information for Himalayan Aama self-catering 1BHK apartment in Lakeside, Pokhara near Phewa Lake.",
    alternates: {
        canonical: "https://himalayanama.com/disclaimer",
    },
    openGraph: {
        title: "Disclaimer & Guest Information | Himalayan Aama - Lakeside Pokhara",
        description: "Official legal disclaimer and guest responsibility guidelines for staying at Himalayan Aama, Pokhara.",
        url: "https://himalayanama.com/disclaimer",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Aama Disclaimer" }],
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
