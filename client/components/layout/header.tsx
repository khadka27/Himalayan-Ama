"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { push } = useRouter()
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/apartments", label: "Apartments" },
    { href: "/services", label: "Amenities" },
    { href: "/blog", label: "Journal" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="fixed top-6 left-0 right-0 z-50 mx-auto w-[95%] max-w-6xl rounded-full border border-white/20 bg-white/80 backdrop-blur-xl shadow-xl transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-6 md:px-8">
          <Link href="/" className="text-xl font-bold tracking-tighter text-blue-600">
            Himalayan Ama
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest transition-all relative hover:text-blue-600",
                  isActive(link.href)
                    ? "text-blue-600"
                    : "text-gray-600",
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => push("/apartments")}
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-10 px-6 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Book Now
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-900 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-[calc(100%+10px)] left-0 right-0 rounded-3xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-2xl p-4 md:hidden animate-in slide-in-from-top-2 fade-in-20">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <span className="font-bold text-sm tracking-wide">{link.label}</span>
                  {isActive(link.href) && <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                </Link>
              ))}
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  push("/apartments")
                }}
                className="mt-2 w-full bg-blue-600 text-white font-bold h-12 rounded-xl"
              >
                Find an Apartment
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
