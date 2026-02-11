import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-blue-500 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">Himalayan Ama</h3>
            <p className="text-sm text-blue-50 leading-relaxed font-medium">
              Premium living experiences in the heart of Pokhara. Discover luxury and tranquility with us.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest">Connect</h4>
            <ul className="space-y-3 text-sm font-medium text-blue-50">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/apartments" className="hover:text-white transition-colors">Explore Stays</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Amenities</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Guest Reviews</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest">Locations</h4>
            <ul className="space-y-3 text-sm font-medium text-blue-50">
              <li>Pokhara Lakeside</li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-widest">Reach Out</h4>
            <ul className="space-y-4 text-sm font-medium text-blue-50">
              <li className="flex items-center gap-3">
                <span className="opacity-70">Address:</span> Pokhara, Nepal
              </li>
              <li className="flex items-center gap-3">
                <span className="opacity-70">Phone:</span>
                <a href="https://wa.me/9779816685279" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +977-9816685279
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="opacity-70">Email:</span>
                <a href="mailto:info@himalayanama.com" className="hover:text-white transition-colors">
                  info@himalayanama.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs font-bold uppercase tracking-widest text-blue-100/50 md:flex-row">
          <p>© 2025 Himalayan Ama. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/policies" className="hover:text-white transition-colors">Safety Policies</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
