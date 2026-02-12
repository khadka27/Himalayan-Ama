import { Metadata } from 'next'
import AboutPage from './about-client'

export const metadata: Metadata = {
    title: "About Us | Our Story and Vision",
    description: "Discover the passion and vision behind Himalayan Ama's luxury residences in Pokhara. Learn about our commitment to elevating the art of Nepalese living.",
    alternates: {
        canonical: "https://himalayanama.com/about",
    },
}

export default function Page() {
    return <AboutPage />
}
