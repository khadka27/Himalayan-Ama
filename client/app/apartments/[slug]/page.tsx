import { Metadata, ResolvingMetadata } from 'next'
import ApartmentDetailClient from './apartment-detail-client'
import axiosInstance from '@/services/axios-instance'
import JsonLd from '@/components/seo/json-ld'
import { getApartmentSchema, getBreadcrumbSchema } from '@/lib/seo'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    try {
        const { data } = await axiosInstance.get(`/api/v1/flats/${slug}`)

        if (data.success && data.flat) {
            const flat = data.flat
            const previousImages = (await parent).openGraph?.images || []
            const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

            const flatImage = flat.imagesUri && flat.imagesUri.length > 0
                ? (flat.imagesUri[0].startsWith("http") ? flat.imagesUri[0] : `${BACKEND}/images/${flat.imagesUri[0]}`)
                : "https://himalayanama.com/og-image.jpg";

            return {
                title: `${flat.flatName} | Luxury Apartment in Pokhara`,
                description: flat.description || `Experience luxury living at ${flat.flatName} in ${flat.location}. Book your premium stay with Himalayan Ama.`,
                alternates: {
                    canonical: `https://himalayanama.com/apartments/${slug}`,
                },
                openGraph: {
                    title: `${flat.flatName} | Luxury Apartment in Pokhara`,
                    description: flat.description,
                    url: `https://himalayanama.com/apartments/${slug}`,
                    siteName: 'Himalayan Ama',
                    images: [flatImage, ...previousImages],
                    type: 'website',
                },
                twitter: {
                    card: 'summary_large_image',
                    title: flat.flatName,
                    description: flat.description,
                    images: [flatImage],
                },
            }
        }
    } catch (error) {
        console.error('Error generating metadata for apartment:', error)
    }

    return {
        title: 'Luxury Apartment | Himalayan Ama',
    }
}

export default async function Page({ params }: Props) {
    const slug = (await params).slug
    let flat = null

    try {
        const { data } = await axiosInstance.get(`/api/v1/flats/${slug}`)
        if (data.success && data.flat) {
            flat = data.flat
        }
    } catch (error) {
        console.error('Error fetching apartment for JSON-LD:', error)
    }

    const apartmentSchema = flat ? getApartmentSchema(flat) : null
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Apartments", item: "/apartments" },
        { name: flat?.flatName || "Apartment Detail", item: `/apartments/${slug}` }
    ])

    return (
        <>
            {apartmentSchema && <JsonLd data={apartmentSchema} />}
            <JsonLd data={breadcrumbSchema} />
            <ApartmentDetailClient />
        </>
    )
}
