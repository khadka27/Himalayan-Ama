import { Metadata } from 'next'
import ContactPage from './contact-client'

export const metadata: Metadata = {
    title: "Contact Us | Get in Touch",
    description: "Have questions about our luxury apartments in Pokhara? Reach out to Himalayan Ama for inquiries, bookings, and concierge services.",
    alternates: {
        canonical: "https://himalayanama.com/contact",
    },
}

export default function Page() {
    return <ContactPage />
}
