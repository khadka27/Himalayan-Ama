import type React from "react";
import type { Metadata } from "next";
import { Marcellus, Karla, Playfair_Display } from "next/font/google"; // Updated import
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

export const metadata: Metadata = {
  title: "Himalayan Ama | Luxury Apartment Rentals in Pokhara",
  description:
    "Experience premium living at Himalayan Ama. We offer luxury apartment rentals in the heart of Pokhara Waterfall, providing comfort, style, and authentic Nepalese hospitality.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} ${serifFont.variable} antialiased`}
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
