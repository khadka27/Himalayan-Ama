import type React from "react";
import type { Metadata } from "next";
import { Marcellus, Karla, Playfair_Display, Lexend } from "next/font/google"; // Updated import
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "./provider";
import { AppProvider } from "@/context/AppContext";
import { OfferBanner } from "@/components/offer-banner";
import { FloatingActions } from "@/components/layout/floating-actions";

const headingFont = Marcellus({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
});

const bodyFont = Karla({
  subsets: ["latin"],
  variable: "--font-body",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const playfulFont = Lexend({
  subsets: ["latin"],
  variable: "--font-playful",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
    template: "%s | Himalayan Ama"
  },
  description: "Experience premium living at Himalayan Ama. We offer luxury apartment rentals in the heart of Pokhara Waterfall, providing comfort, style, and authentic Nepalese hospitality.",
  keywords: ["luxury apartments Pokhara", "vacation rentals Nepal", "Himalayan Ama rentals", "short stay Pokhara", "premium accommodation Nepal", "Pokhara Waterfall stay"],
  authors: [{ name: "Himalayan Ama" }],
  creator: "Himalayan Ama",
  publisher: "Himalayan Ama",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://himalayanama.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
    description: "Experience premium living at Himalayan Ama. We offer luxury apartment rentals in the heart of Pokhara Waterfall.",
    url: "https://himalayanama.com",
    siteName: "Himalayan Ama",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Assuming this will be created or exists
        width: 1200,
        height: 630,
        alt: "Himalayan Ama Luxury Apartments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
    description: "Experience premium living at Himalayan Ama. Luxury apartment rentals in the heart of Pokhara Waterfall.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} ${serifFont.variable} ${playfulFont.variable} antialiased`}
      >
        <Providers>
          <AppProvider>
            <OfferBanner />
            <FloatingActions />
            <main
              style={{
                paddingTop: "var(--banner-height, 0px)",
                transition: "padding-top 0.5s ease"
              }}
            >
              {children}
            </main>
          </AppProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
