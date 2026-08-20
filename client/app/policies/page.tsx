import { Metadata } from 'next'
import PoliciesPageClient from './policies-client'
import JsonLd from '@/components/seo/json-ld'
import { getFAQSchema, getBreadcrumbSchema } from '@/lib/seo'

export const metadata: Metadata = {
    title: "Privacy Policy | Himalayan Aama - Lakeside Pokhara",
    description: "Read the official Privacy Policy for Himalayan Aama self-catering 1BHK apartment in Lakeside, Pokhara. Learn how we collect, protect, and handle your data.",
    alternates: {
        canonical: "https://himalayanama.com/policies",
    },
    openGraph: {
        title: "Privacy Policy | Himalayan Aama - Lakeside Pokhara",
        description: "Official Privacy Policy and data protection guidelines for guests staying at Himalayan Aama, Pokhara.",
        url: "https://himalayanama.com/policies",
        siteName: "Himalayan Aama",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Himalayan Aama Privacy Policy" }],
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
