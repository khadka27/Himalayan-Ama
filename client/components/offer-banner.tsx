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
            const { data } = await axiosInstance.get("/api/v1/banner")

            if (data.success && data.banner) {
                const banner = data.banner;
                if (banner.isActive) {
                    setBannerData({
                        text: banner.bannerText || "",
                        backgroundColor: banner.backgroundColor || "#3B82F6",
                        textColor: banner.textColor || "#ffffff",
                        isActive: true
                    })
                    setIsVisible(true)
                } else {
                    setIsVisible(false)
                }
            } else {
                setIsVisible(false)
            }
        } catch (err) {
            console.error("Failed to fetch banner")
            setIsVisible(false)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isVisible) {
            document.documentElement.style.setProperty('--banner-height', '40px') // Estimated height, will refine
        } else {
            document.documentElement.style.setProperty('--banner-height', '0px')
        }
    }, [isVisible])

    const handleClose = () => {
        setIsVisible(false)
        sessionStorage.setItem("offer-banner-dismissed", "true")
        document.documentElement.style.setProperty('--banner-height', '0px')
    }

    if (isLoading) return null

    if (!isVisible) return null

    return (
        <div
            className="fixed top-0 left-0 right-0 text-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] z-[60] transition-all duration-500 shadow-xl flex items-center h-10"
            style={{
                backgroundColor: bannerData.backgroundColor,
                color: bannerData.textColor
            }}
        >
            <div className="container mx-auto flex items-center justify-center px-4 gap-4">
                <Sparkles className="h-3 w-3 md:h-4 md:w-4 animate-pulse shrink-0" />
                <div className="flex-1 truncate">
                    {bannerData.text}
                </div>
                <button
                    onClick={handleClose}
                    className="h-6 w-6 md:h-8 md:w-8 rounded-lg md:rounded-xl bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all backdrop-blur-md border border-white/10"
                    aria-label="Close banner"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}
