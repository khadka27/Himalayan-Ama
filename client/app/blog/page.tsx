import { Metadata } from 'next'
import BlogListingPage from './blog-listing-client'

export const metadata: Metadata = {
    title: "Journal | Himalayan Ama Stories & Guides",
    description: "Read our journal for travel guides, stories from Pokhara, and insights into luxury living in Nepal. Stay updated with Himalayan Ama.",
    alternates: {
        canonical: "https://himalayanama.com/blog",
    },
}

export default function Page() {
    return <BlogListingPage />
}
