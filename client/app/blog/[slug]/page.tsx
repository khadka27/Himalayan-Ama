import { Metadata, ResolvingMetadata } from 'next'
import BlogDetailClient from './blog-detail-client'
import axiosInstance from '@/services/axios-instance'
import JsonLd from '@/components/seo/json-ld'
import { getBlogPostingSchema, getBreadcrumbSchema } from '@/lib/seo'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    try {
        const { data } = await axiosInstance.get(`/api/v1/blog/getBlog?slug=${slug}`)

        if (data.success && data.blog) {
            const blog = data.blog
            const previousImages = (await parent).openGraph?.images || []
            const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
            const blogImage = blog.bannerImageURI
                ? (blog.bannerImageURI.startsWith("http") ? blog.bannerImageURI : `${BACKEND}/images/${blog.bannerImageURI}`)
                : "https://himalayanama.com/og-image.jpg";

            return {
                title: blog.title,
                description: blog.shortDescription || blog.subtitle || "Read the latest from Himalayan Ama journal.",
                alternates: {
                    canonical: `https://himalayanama.com/blog/${slug}`,
                },
                openGraph: {
                    title: blog.title,
                    description: blog.shortDescription || blog.subtitle,
                    url: `https://himalayanama.com/blog/${slug}`,
                    siteName: 'Himalayan Ama',
                    images: [blogImage, ...previousImages],
                    type: 'article',
                    publishedTime: blog.publishDate || blog.createdAt,
                    authors: [blog.author?.authorName || 'Himalayan Ama'],
                },
                twitter: {
                    card: 'summary_large_image',
                    title: blog.title,
                    description: blog.shortDescription || blog.subtitle,
                    images: [blogImage],
                },
            }
        }
    } catch (error) {
        console.error('Error generating metadata for blog:', error)
    }

    return {
        title: 'Blog Post | Himalayan Ama',
    }
}

export default async function Page({ params }: Props) {
    const slug = (await params).slug
    let blog = null

    try {
        const { data } = await axiosInstance.get(`/api/v1/blog/getBlog?slug=${slug}`)
        if (data.success && data.blog) {
            blog = data.blog
        }
    } catch (error) {
        console.error('Error fetching blog for JSON-LD:', error)
    }

    const blogSchema = blog ? getBlogPostingSchema(blog) : null
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Journal", item: "/blog" },
        { name: blog?.title || "Article", item: `/blog/${slug}` }
    ])

    return (
        <>
            {blogSchema && <JsonLd data={blogSchema} />}
            <JsonLd data={breadcrumbSchema} />
            <BlogDetailClient />
        </>
    )
}
