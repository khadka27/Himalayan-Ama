import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight text-white">Himalayan Aama</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Self-Catering 1BHK in Lakeside Pokhara
              </p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Peaceful, private, and BBQ-friendly apartment stay near Phewa Lake. Experience home-like comfort with local Nepali warmth.
            </p>
            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Twitter, href: "https://twitter.com" },
                { icon: Youtube, href: "https://youtube.com" }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all border border-slate-700"
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-blue-400">Explore</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-300">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">Our Story</Link></li>
              <li><Link href="/apartments" className="hover:text-blue-400 transition-colors">Explore Stays (1BHK)</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition-colors">Amenities & BBQ</Link></li>
              <li><Link href="/reviews" className="hover:text-blue-400 transition-colors">Guest Reviews</Link></li>
              <li><Link href="/write-for-us" className="hover:text-blue-400 transition-colors">Write for Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-blue-400">Policies & Legal</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-300">
              <li><Link href="/policies" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-blue-400 transition-colors">Cancellation & Refund Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Use</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer & Guest Info</Link></li>
            </ul>
          </div>

          {/* Reach Out / Location */}
          <div>
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-blue-400">Reach Out</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <span>Street No. 16, Lakeside, Pokhara, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-400 shrink-0" />
                <a href="https://wa.me/9779816685279" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  +977 9816685279 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400 shrink-0" />
                <a href="mailto:info@himalayanAama.com" className="hover:text-blue-400 transition-colors">
                  info@himalayanAama.com
                </a>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <span>Near Phewa Lake, Pokhara</span>
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 text-xs font-bold uppercase tracking-widest text-slate-400 md:flex-row">
          <p>© 2026 Himalayan Aama. All rights reserved.</p>
          <div className="flex flex-wrap gap-6 md:gap-8">
            <Link href="/policies" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
