"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Menu, X, Home, Info, Building2, Sparkles, BookOpen, Star, Phone } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { push } = useRouter()
  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: Info },
    { href: "/apartments", label: "Apartments", icon: Building2 },
    { href: "/services", label: "Amenities", icon: Sparkles },
    { href: "/blog", label: "Journal", icon: BookOpen },
    { href: "/reviews", label: "Reviews", icon: Star },
    { href: "/contact", label: "Contact", icon: Phone },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className="fixed left-0 right-0 z-50 mx-auto w-[95%] max-w-6xl rounded-3xl md:rounded-full border border-white/20 bg-white/60 backdrop-blur-2xl shadow-xl transition-all duration-300"
        style={{
          top: `calc(var(--banner-height, 0px) + ${pathname === "/" ? "16px" : "8px"})`,
        }}
      >
        <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="text-lg md:text-xl font-bold tracking-tighter text-blue-600">
            Himalayan Ama
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.label}
                className={cn(
                  "p-2 rounded-full transition-all relative hover:bg-blue-50/50 group",
                  isActive(link.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-400 hover:text-blue-500",
                )}
              >
                <link.icon className="h-5 w-5" />
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-600" />
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100 pointer-events-none whitespace-nowrap text-slate-600">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={() => push("/apartments")}
              className="hidden xs:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-9 md:h-10 px-4 md:px-6 shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 text-xs md:text-sm"
            >
              Book Now
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-900 h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
                  <div className="flex items-center gap-3">
                    <link.icon className="h-5 w-5" />
                    <span className="font-bold text-sm tracking-wide">{link.label}</span>
                  </div>
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
