import { Metadata } from 'next'
import AboutPage from './about-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "About Us | Our Story & Vision",
    description: "Discover the passion and vision behind Himalayan Ama's luxury residences in Pokhara. Learn about our commitment to elevating the art of Nepalese living.",
    alternates: {
        canonical: "https://himalayanama.com/about",
    },
    openGraph: {
        title: "About Himalayan Ama | Luxury Living in Pokhara",
        description: "Learn about Himalayan Ama's story, vision, and dedication to authentic Nepalese hospitality and luxury accommodations.",
        url: "https://himalayanama.com/about",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "About Himalayan Ama" }],
        type: "website"
    }
}

export default function Page() {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Himalayan Ama",
        "url": `${SITE_URL}/about`,
        "description": "Discover the passion and vision behind Himalayan Ama's luxury residences in Pokhara."
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "About Us", item: "/about" }
    ])

    return (
        <>
            <JsonLd data={aboutSchema} />
            <JsonLd data={breadcrumbSchema} />
            <AboutPage />
        </>
    )
}
