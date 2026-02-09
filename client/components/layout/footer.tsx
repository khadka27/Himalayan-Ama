import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#4A5D4C] text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Himalayan Yogini</h3>
            <p className="text-sm text-white/70">Transforming lives through the power of yoga and mindful living.</p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Classes */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Classes</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/services" className="hover:text-white">
                  Morning Flow
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Evening Relaxation
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Power Yoga
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Yin Yoga
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Prenatal Yoga
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Group Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Pokhara, Nepal</li>
              <li>+977-9816685279 | +977-9816685280</li>
              <li>himalayanyogini@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>© 2025 Himalayan Yogini. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/policies" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
