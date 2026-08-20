import { Metadata } from 'next'
import AboutPage from './about-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "About Himalayan Aama | Self-Catering 1BHK Apartment in Lakeside Pokhara",
    description: "Welcome to Himalayan Aama, a peaceful self-catering 1BHK apartment in Lakeside, Pokhara near Phewa Lake. Enjoy privacy, fully furnished kitchen, and outdoor BBQ area.",
    alternates: {
        canonical: "https://himalayanama.com/about",
    },
    openGraph: {
        title: "About Himalayan Aama | Self-Catering 1BHK Apartment in Lakeside Pokhara",
        description: "Experience home-like comfort, self-cooking kitchen, and peaceful privacy near Phewa Lake at Himalayan Aama.",
        url: "https://himalayanama.com/about",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "About Himalayan Aama" }],
        type: "website"
    }
}

export default function Page() {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Himalayan Aama",
        "url": `${SITE_URL}/about`,
        "description": "A peaceful self-catering 1BHK apartment in Lakeside, Pokhara near Phewa Lake with private kitchen and BBQ compound."
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
