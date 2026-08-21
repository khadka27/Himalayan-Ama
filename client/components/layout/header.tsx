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
        className="fixed left-0 right-0 z-50 mx-auto w-[95%] max-w-6xl rounded-3xl md:rounded-full border border-white/30 bg-white/20 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.12),inset_0_1px_2px_0_rgba(255,255,255,0.6)] transition-all duration-300"
        style={{
          top: `calc(var(--banner-height, 0px) + ${pathname === "/" ? "16px" : "8px"})`,
        }}
      >
        <div className="flex h-14 md:h-16 items-center justify-between px-4 md:px-8">
          <Link href="/" className="text-lg md:text-xl font-bold tracking-tighter text-blue-600 shrink-0">
            Himalayan Ama
          </Link>

          {/* Right-aligned container for Nav + Actions */}
          <div className="flex items-center gap-3 md:gap-5 ml-auto">
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1.5 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={cn(
                    "p-2.5 rounded-full transition-all relative group flex items-center justify-center",
                    isActive(link.href)
                      ? "text-blue-600 bg-white/70 shadow-sm border border-white/60 backdrop-blur-sm"
                      : "text-slate-700 hover:text-blue-600 hover:bg-white/40",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm" />
                  )}
                  <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 backdrop-blur-sm text-slate-800 px-2.5 py-1 rounded-lg shadow-md border border-white/60 pointer-events-none whitespace-nowrap">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            <Button
              onClick={() => push("/apartments")}
              className="hidden xs:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full h-9 md:h-10 px-4 md:px-6 shadow-lg shadow-blue-500/20 backdrop-blur-sm border border-blue-400/30 transition-all hover:scale-105 active:scale-95 text-xs md:text-sm shrink-0"
            >
              Book Now
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-900 h-9 w-9 flex items-center justify-center rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/40 transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-[calc(100%+10px)] left-0 right-0 rounded-3xl border border-white/40 bg-white/50 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.15),inset_0_1px_2px_0_rgba(255,255,255,0.7)] p-4 md:hidden animate-in slide-in-from-top-2 fade-in-20">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-2xl transition-all",
                    isActive(link.href)
                      ? "bg-white/70 text-blue-600 shadow-sm border border-white/60 font-bold"
                      : "text-slate-700 hover:bg-white/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="h-5 w-5" />
                    <span className="font-bold text-sm tracking-wide">{link.label}</span>
                  </div>
                  {isActive(link.href) && <div className="h-2 w-2 rounded-full bg-blue-600 shadow-sm" />}
                </Link>
              ))}
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  push("/apartments")
                }}
                className="mt-2 w-full bg-blue-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-500/20"
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
