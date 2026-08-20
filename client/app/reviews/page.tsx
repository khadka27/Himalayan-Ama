import { Metadata } from 'next'
import ReviewsPageClient from './reviews-client'
import JsonLd from '@/components/seo/json-ld'
import { getBreadcrumbSchema, getAggregateRatingSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Guest Reviews & Experiences | Himalayan Ama Lakeside Pokhara",
    description: "See what travelers say about their stay at Himalayan Ama and their experience of a comfortable, home-like self-catering stay in Lakeside, Pokhara.",
    alternates: {
        canonical: "https://himalayanama.com/reviews",
    },
    openGraph: {
        title: "Guest Reviews & Experiences | Himalayan Ama Lakeside Pokhara",
        description: "Read verified Google reviews and authentic feedback from travelers who stayed at Himalayan Ama in Lakeside, Pokhara.",
        url: "https://himalayanama.com/reviews",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Guest Reviews" }],
        type: "website"
    }
}

export default function ReviewsPage() {
    const featuredReviews = [
        { userName: "Krishna Thapa", rating: 5, review: "Straight from the trekking and we're dead until 10am with pindrop silence. Complimentary breakfast to understand our situation by Shyam, felt a motherly home away from the home." },
        { userName: "Khangsar Tenzin Sangpo", rating: 5, review: "Spent totally 1 week with full of silence and peaceful. Very supportive host. Walking distance for lakeside." },
        { userName: "Aarsang", rating: 5, review: "I along with my family absolutely enjoyed a week here. It's just 5km away from the lakeside and yet small paradise with Yogic energy and people around." },
        { userName: "Ngawang Tsering", rating: 5, review: "Small paradise is located in the hills of Khapaudi village. Surrounded by paddy fields, smell of fruits trees and songs of the birds/insects." },
        { userName: "Jampa Lekdhen", rating: 5, review: "Seeing the Phewalake throughout the day and listening to music of birds/insects have been very nostalgic." },
        { userName: "Denisha Gurung", rating: 5, review: "Lovely place with so much nature to offering. Listening to those insect and birds singing were so soothing." },
        { userName: "Tsering Norbu", rating: 5, review: "Very tranquil and spiritual place to be. The Host Shyam and his teams were all the time assisting as well as making you FEEL like a home." }
    ]

    const ratingSchema = getAggregateRatingSchema(featuredReviews)
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Reviews", item: "/reviews" }
    ])

    return (
        <>
            {ratingSchema && <JsonLd data={ratingSchema} />}
            <JsonLd data={breadcrumbSchema} />
            <ReviewsPageClient />
        </>
    )
}
