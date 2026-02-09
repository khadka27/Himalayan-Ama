"use client"

import { useState, useEffect } from "react"
import { X, Sparkles } from "lucide-react"
import { usePathname } from "next/navigation"
import axiosInstance from "@/services/axios-instance"

export function OfferBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const [bannerData, setBannerData] = useState({
        text: "",
        backgroundColor: "#3B82F6", // Lighter blue
        textColor: "#ffffff",
        isActive: false
    })

    useEffect(() => {
        const checkBanner = async () => {
            if (pathname?.startsWith("/admin")) {
                setIsVisible(false)
                setIsLoading(false)
                return
            }

            const dismissed = sessionStorage.getItem("offer-banner-dismissed")
            if (dismissed) {
                setIsVisible(false)
                setIsLoading(false)
                return
            }

            try {
                await fetchBannerData()
            } catch (error) {
                console.error("Error checking banner:", error)
                setIsLoading(false)
            }
        }

        checkBanner()
    }, [pathname])

    const fetchBannerData = async () => {
        try {
            const { data } = await axiosInstance.get("/api/banner")

            let banner = null;
            if (Array.isArray(data) && data.length > 0) {
                banner = data[0];
            } else if (data.status && data.data) {
                banner = data.data;
            } else if (data.id) {
                banner = data;
            }

            if (banner) {
                const isActive = banner.is_active === true || banner.is_active === "active" || banner.is_active === 1

                if (isActive) {
                    setBannerData({
                        text: banner.banner_text || "",
                        backgroundColor: banner.background_color || "#3B82F6",
                        textColor: banner.text_color || "#ffffff",
                        isActive: true
                    })
                    setIsVisible(true)
                }
            }
        } catch (err) {
            console.error("Failed to fetch banner")
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem("offer-banner-dismissed", "true")
    }

    if (isLoading) return null

    if (!isVisible) return null

    return (
        <div
            className="relative px-6 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] z-50 transition-all duration-500 shadow-2xl"
            style={{
                backgroundColor: bannerData.backgroundColor,
                color: bannerData.textColor
            }}
        >
            <div className="container mx-auto flex items-center justify-center gap-4">
                <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
                <div className="flex-1 truncate">
                    {bannerData.text}
                </div>
                <button
                    onClick={handleClose}
                    className="h-8 w-8 rounded-xl bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all backdrop-blur-md border border-white/10"
                    aria-label="Close banner"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
