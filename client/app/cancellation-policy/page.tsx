import { Metadata } from 'next'
import CancellationPolicyClient from './cancellation-policy-client'
import JsonLd from '@/components/seo/json-ld'
import { getFAQSchema, getBreadcrumbSchema, SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Cancellation & Refund Policy | Himalayan Aama - Lakeside Pokhara",
    description: "Read the official Cancellation & Refund Policy for Himalayan Aama self-catering 1BHK apartment in Lakeside, Pokhara. Learn about booking cancellations, refund timelines, and date modifications.",
    alternates: {
        canonical: "https://himalayanama.com/cancellation-policy",
    },
    openGraph: {
        title: "Cancellation & Refund Policy | Himalayan Aama - Lakeside Pokhara",
        description: "Flexible, transparent booking cancellation and refund rules for guests staying at Himalayan Aama, Pokhara.",
        url: "https://himalayanama.com/cancellation-policy",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Aama Cancellation Policy" }],
        type: "website"
    }
}

export default function Page() {
    const faqSchema = getFAQSchema([
        {
            question: "What is the cancellation policy for Himalayan Aama?",
            answer: "7+ days before check-in: Full cancellation. 3-6 days before check-in: 50% consideration. Less than 3 days: Admin approval required."
        },
        {
            question: "How long do refunds take?",
            answer: "Refunds (if applicable) are processed manually by admin and typically take 5-7 business days."
        },
        {
            question: "Can I modify my booking dates?",
            answer: "Yes, modifications are subject to availability. Contact info@himalayanAama.com or call +977 9816685279."
        }
    ])

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Cancellation Policy", item: "/cancellation-policy" }
    ])

    return (
        <>
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />
            <CancellationPolicyClient />
        </>
    )
}
