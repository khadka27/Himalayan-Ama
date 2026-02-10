"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { LayoutDashboard, BookOpen, Users, Calendar, FileText, MessageSquare, LogOut, Settings, Star, UserCheck, Megaphone, Home, Sparkles, Menu, X } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}


interface AdminSidebarProps {
  isOpen?: boolean
  closeSidebar?: () => void
}

export function AdminSidebar({ isOpen, closeSidebar }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isSuperAdmin, setIsSuperAdmin] = useState<Boolean>(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const TOKEN = Cookies.get("auth_token")

  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    ...(isSuperAdmin
      ? [
        {
          name: "Users",
          href: "/admin/dashboard/users",
          icon: <Users size={20} />,
        },
      ]
      : []),
    { name: "Blogs", href: "/admin/dashboard/blogs", icon: <BookOpen size={20} /> },
    { name: "Apartments", href: "/admin/dashboard/apartments", icon: <Home size={20} /> },
    { name: "Amenities", href: "/admin/dashboard/services", icon: <Sparkles size={20} /> },
    { name: "Bookings", href: "/admin/dashboard/bookings", icon: <FileText size={20} /> },
    { name: "Reviews", href: "/admin/dashboard/reviews", icon: <Star size={20} /> },
    { name: "Service Offers", href: "/admin/dashboard/offers", icon: <Calendar size={20} /> },
    { name: "Offer Banner", href: "/admin/dashboard/offer-banner", icon: <Megaphone size={20} /> },
  ]


  const handleLogout = async () => {
    //   const { data } = await axiosInstance.get("/api/logout", { headers: {
    //   'Authorization': `Bearer ${TOKEN}`
    // }})
    //   if (data.status) {
    //     toast.success(data.message || "Logged out");
    //     router.push("/");
    //   } else {
    //     toast.info(data.message || "Error while logging out");
    //     router.push("/");
    //   }

    Cookies.remove("auth_token")
    toast.success("Logged out");
    router.push("/");
  }


  useEffect(() => {
    setIsLoading(true);
    try {
      const getUserDetails = async () => {
        const { data } = await axiosInstance.get("/api/user", {
          headers: {
            'Authorization': `Bearer ${TOKEN}`
          }
        })

        if (data.status) {
          if (data.role === "super_admin") {
            setIsSuperAdmin(true);
          } else {
            setIsSuperAdmin(false);
          }
        } else {
          router.push("/admin/login");
        }
      }

      getUserDetails()
    } catch (err) {
      const Err = err as Error;
      toast.info(Err.message);
    } finally {
      setIsLoading(false);
    }

  }, [])
  return (
    <aside className={`w-64 bg-gradient-to-b from-blue-900 to-slate-900 text-white h-screen fixed left-0 top-0 shadow-xl flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {/* Logo */}
      <div className="p-6 border-b border-blue-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-lg font-serif font-bold text-blue-900">A</span>
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold">Himalayan Ama</h1>
            <p className="text-xs text-blue-200">Admin</p>
          </div>
        </div>
        <button onClick={closeSidebar} className="md:hidden text-white/70 hover:text-white p-1">
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-white text-blue-900 font-medium shadow-md" : "text-white hover:bg-blue-800/50"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-blue-800 shrink-0">
        <div
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-blue-800/50 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  )
}
