import { MetadataRoute } from 'next'
import axiosInstance from '@/services/axios-instance'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://himalayanama.com'

    // Fetch blogs
    let blogs = []
    try {
        const { data } = await axiosInstance.get('/api/v1/blog/getPublishedBlogs')
        if (data.success && Array.isArray(data.blogs)) {
            blogs = data.blogs
        }
    } catch (error) {
        console.error('Failed to fetch blogs for sitemap:', error)
    }

    // Fetch flats
    let flats = []
    try {
        const { data } = await axiosInstance.get('/api/v1/flats/published')
        if (data.success && Array.isArray(data.flats)) {
            flats = data.flats
        }
    } catch (error) {
        console.error('Failed to fetch flats for sitemap:', error)
    }

    const blogEntries: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || blog.publishDate || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    const flatEntries: MetadataRoute.Sitemap = flats.map((flat: any) => ({
        url: `${baseUrl}/apartments/${flat._id}`,
        lastModified: flat.updatedAt || flat.createdAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/apartments`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...flatEntries,
        ...blogEntries,
    ]
}
