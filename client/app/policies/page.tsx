import { Metadata } from 'next'
import PoliciesPageClient from './policies-client'
import JsonLd from '@/components/seo/json-ld'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Rental Policies & Guidelines | Himalayan Ama",
    description: "Review Himalayan Ama's rental, booking, cancellation, and security deposit policies for a seamless luxury apartment stay in Pokhara.",
    alternates: {
        canonical: "https://himalayanama.com/policies",
    },
    openGraph: {
        title: "Rental Policies & Guidelines | Himalayan Ama",
        description: "Transparency and fairness for guests. Review booking, cancellation, and check-in standards at Himalayan Ama.",
        url: "https://himalayanama.com/policies",
        siteName: "Himalayan Ama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Ama Policies" }],
        type: "website"
    }
}

export default function PoliciesPage() {
    const faqSchema = getFAQSchema([
        {
            question: "What is the cancellation policy for Himalayan Ama?",
            answer: "We offer a Standard policy (full refund 14+ days prior), Flexible (50% refund 7-14 days prior), and Non-refundable under 7 days before check-in."
        },
        {
            question: "Is a security deposit required?",
            answer: "Yes. Short-term stays under 30 days require a 1-week rent deposit, and long-term rentals 30+ days require 1 month deposit, fully refundable within 7 business days post-inspection."
        },
        {
            question: "What are the check-in and check-out times?",
            answer: "Check-in starts from 2:00 PM onwards, and check-out is until 11:00 AM."
        }
    ])

    const breadcrumbSchema = getBreadcrumbSchema([
        { name: "Home", item: "/" },
        { name: "Policies", item: "/policies" }
    ])

    return (
        <>
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />
            <PoliciesPageClient />
        </>
    )
}
