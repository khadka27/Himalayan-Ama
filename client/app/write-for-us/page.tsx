import { Metadata } from 'next'
import WriteForUsClient from './write-for-us-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Write for Us | Himalayan Aama - Travel & Accommodation Guest Posts",
    description: "Contribute travel guides, Pokhara sightseeing tips, self-catering apartment advice, and culture stories to Himalayan Aama. Read our submission guidelines and write for us.",
    alternates: {
        canonical: "https://himalayanama.com/write-for-us",
    },
    openGraph: {
        title: "Write for Us | Himalayan Aama - Travel & Accommodation Guest Posts",
        description: "Share your travel stories, Pokhara tips, and self-catering 1BHK apartment guides on Himalayan Aama blog.",
        url: "https://himalayanama.com/write-for-us",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Write for Us - Himalayan Aama" }],
        type: "website"
    }
}

export default function Page() {
    const pageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Write for Us – Himalayan Aama",
        "url": `${SITE_URL}/write-for-us`,
        "description": "Guest post submission guidelines and information for Himalayan Aama travel blog."
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Write for Us", item: "/write-for-us" }
    ])

    return (
        <>
            <JsonLd data={pageSchema} />
            <JsonLd data={breadcrumbSchema} />
            <WriteForUsClient />
        </>
    )
}
