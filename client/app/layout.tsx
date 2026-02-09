import type React from "react";
import type { Metadata } from "next";
import { Marcellus, Karla } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Providers from "./provider";
import { AppProvider } from "@/context/AppContext";

const headingFont = Marcellus({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: "400",
});

import { OfferBanner } from "@/components/offer-banner";
import { FloatingActions } from "@/components/layout/floating-actions";



const bodyFont = Karla({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Himalayan Yogii - Yoga Studio in Pokhara",
  description:
    "Discover transformative yoga practices in the heart of Pokhara. Expert-led classes including Hatha, Vinyasa, Ashtanga, and more. Your journey to inner harmony begins here.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
      >
        <Providers>
          <AppProvider>
            <OfferBanner />
            <FloatingActions />
            {children}
          </AppProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
