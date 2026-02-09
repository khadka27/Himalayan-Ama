"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { push } = useRouter()
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/apartments", label: "Apartments" },
    { href: "/blog", label: "Blog" },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#5a7a59]">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="text-xl font-semibold text-white">
            Yogini
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors relative",
                  isActive(link.href)
                    ? "text-white font-medium after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-white"
                    : "text-white/70 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button onClick={() => push("/apartments")} className="bg-white text-[#627A64] hover:bg-white/90">
              Find an Apartment
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#627A64]">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-sm transition-colors py-2",
                    isActive(link.href)
                      ? "text-white font-medium border-l-2 border-white pl-4"
                      : "text-white/70 hover:text-white pl-4",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
