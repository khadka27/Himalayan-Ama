"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import axiosInstance from "@/services/axios-instance"

export interface Flat {
  _id: string
  flatName: string
  location: string
  price: number
  isActive: boolean
  imagesUri: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Offer {
  _id: string
  flat: string | Flat
  discountPercentage: number
  startDate: string
  endDate: string
  description?: string
  isActive: boolean
}

export interface Host {
  _id: string
  hostName: string
  imageUri: string
  profession?: string
  bio?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface Review {
  id: string
  name: string
  review: string
  rating: number
  service_title?: string
  created_at?: string
  avatar_url?: string
}

interface AppContextType {
  flats: Flat[]
  offers: Offer[]
  hosts: Host[]
  reviews: Review[]
  isLoadingFlats: boolean
  isLoadingOffers: boolean
  isLoadingHosts: boolean
  isLoadingReviews: boolean
  isInitialLoading: boolean
  refetchFlats: () => Promise<void>
  refetchOffers: () => Promise<void>
  refetchHosts: () => Promise<void>
  refetchReviews: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [flats, setFlats] = useState<Flat[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [hosts, setHosts] = useState<Host[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingFlats, setIsLoadingFlats] = useState(true)
  const [isLoadingOffers, setIsLoadingOffers] = useState(true)
  const [isLoadingHosts, setIsLoadingHosts] = useState(true)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const fetchFlats = async () => {
    try {
      setIsLoadingFlats(true)
      const { data } = await axiosInstance.get("/api/v1/flats/published")
      if (data?.success && data?.flats) {
        setFlats(data.flats)
      }
    } catch (err) {
      console.error("Error fetching flats:", err)
    } finally {
      setIsLoadingFlats(false)
    }
  }

  const fetchOffers = async () => {
    try {
      setIsLoadingOffers(true)
      const { data } = await axiosInstance.get("/api/v1/offer/active")
      if (data?.success && data?.offers) {
        setOffers(data.offers)
      }
    } catch (err) {
      console.error("Error fetching offers:", err)
    } finally {
      setIsLoadingOffers(false)
    }
  }

  const fetchHosts = async () => {
    try {
      setIsLoadingHosts(true)
      const { data } = await axiosInstance.get("/api/v1/host/getActiveHosts")
      if (data?.success && data?.hosts) {
        setHosts(data.hosts)
      }
    } catch (err) {
      console.error("Error fetching hosts:", err)
    } finally {
      setIsLoadingHosts(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true)
      const { data } = await axiosInstance.get("/api/reviews")
      if (data?.status && data?.data) {
        setReviews(data.data)
      }
    } catch (err) {
      console.error("Error fetching reviews:", err)
    } finally {
      setIsLoadingReviews(false)
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      // optimization: skip fetching heavy public data on admin pages
      if (pathname?.startsWith("/admin")) {
        setIsInitialLoading(false)
        setIsLoadingFlats(false)
        setIsLoadingHosts(false)
        setIsLoadingReviews(false)
        return
      }

      await Promise.all([fetchFlats(), fetchOffers(), fetchHosts(), fetchReviews()])
      setIsInitialLoading(false)
    }

    fetchAllData()
  }, [pathname])

  const value: AppContextType = {
    flats,
    offers,
    hosts,
    reviews,
    isLoadingFlats,
    isLoadingOffers,
    isLoadingHosts,
    isLoadingReviews,
    isInitialLoading,
    refetchFlats: fetchFlats,
    refetchOffers: fetchOffers,
    refetchHosts: fetchHosts,
    refetchReviews: fetchReviews,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
