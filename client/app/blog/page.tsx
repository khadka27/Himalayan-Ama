import { Metadata } from 'next'
import BlogListingPage from './blog-listing-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Journal | Himalayan Ama Stories & Guides",
    description: "Read our journal for travel guides, stories from Pokhara, and insights into luxury living in Nepal. Stay updated with Himalayan Ama.",
    alternates: {
        canonical: "https://himalayanama.com/blog",
    },
    openGraph: {
        title: "Journal & Travel Stories | Himalayan Ama Pokhara",
        description: "Travel guides, Pokhara living insights, and local Nepal recommendations from Himalayan Ama.",
        url: "https://himalayanama.com/blog",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Journal" }],
        type: "website"
    }
}

export default function Page() {
    const blogCatalogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Himalayan Ama Journal",
        "url": `${SITE_URL}/blog`,
        "description": "Travel guides, local stories, and insights into luxury living in Pokhara, Nepal."
    }

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Journal", item: "/blog" }
    ])

    return (
        <>
            <JsonLd data={blogCatalogSchema} />
            <JsonLd data={breadcrumbSchema} />
            <BlogListingPage />
        </>
    )
}
