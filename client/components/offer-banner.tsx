"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { usePathname } from "next/navigation"
import axiosInstance from "@/services/axios-instance"


export function OfferBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const [bannerData, setBannerData] = useState({
        text: "",
        backgroundColor: "#6B8E6A",
        textColor: "#ffffff",
        isActive: false
    })

    useEffect(() => {
        const checkBanner = async () => {
            // Don't show on admin pages
            if (pathname?.startsWith("/admin")) {
                setIsVisible(false)
                setIsLoading(false)
                return
            }

            // Check local storage for dismissed state
            const dismissed = sessionStorage.getItem("offer-banner-dismissed")
            if (dismissed) {
                setIsVisible(false)
                setIsLoading(false)
                return
            }

            try {
                // If fetching data, keep loading true
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
                // Check if active
                const isActive = banner.is_active === true || banner.is_active === "active" || banner.is_active === 1

                if (isActive) {
                    setBannerData({
                        text: banner.banner_text || "",
                        backgroundColor: banner.background_color || "#6B8E6A",
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

    if (isLoading) {
        return (
            <div className="w-full h-10 bg-gray-200 animate-pulse" />
        )
    }

    if (!isVisible) return null

    return (
        <div
            className="relative px-4 py-2 text-center text-sm font-medium z-50 transition-all duration-300"
            style={{
                backgroundColor: bannerData.backgroundColor,
                color: bannerData.textColor
            }}
        >
            <div className="container mx-auto flex items-center justify-center">
                <div className="flex-1">
                    {bannerData.text}
                </div>
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition"
                    aria-label="Close banner"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    )
}
