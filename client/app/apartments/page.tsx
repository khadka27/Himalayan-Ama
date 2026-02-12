import { Metadata } from 'next'
import ApartmentsListingPage from './apartments-listing-client'

export const metadata: Metadata = {
    title: "Luxury Apartments | Explore Our Residences",
    description: "Browse our collection of luxury apartments in Pokhara. Find the perfect residence for your short or long stay at Himalayan Ama.",
    alternates: {
        canonical: "https://himalayanama.com/apartments",
    },
}

export default function Page() {
    return <ApartmentsListingPage />
}
