import { MetadataRoute } from 'next'
import axiosInstance from '@/services/axios-instance'
import { SITE_URL } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL

    // Fetch blogs
    let blogs: any[] = []
    try {
        const { data } = await axiosInstance.get('/api/v1/blog/getPublishedBlogs')
        if (data.success && Array.isArray(data.blogs)) {
            blogs = data.blogs
        }
    } catch (error) {
        console.error('Failed to fetch blogs for sitemap:', error)
    }

    // Fetch flats
    let flats: any[] = []
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
        priority: 0.7,
    }))

    const flatEntries: MetadataRoute.Sitemap = flats.map((flat: any) => ({
        url: `${baseUrl}/apartments/${flat._id}`,
        lastModified: flat.updatedAt || flat.createdAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/apartments`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/reviews`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/policies`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/cancellation-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/write-for-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    return [
        ...staticRoutes,
        ...flatEntries,
        ...blogEntries,
    ]
}
