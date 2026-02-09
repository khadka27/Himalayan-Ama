"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import axiosInstance from "@/services/axios-instance"

interface ClassScheduleItem {
  day: string
  time: string
  duration?: number
}

type ClassScheduleInput = string | string[] | ClassScheduleItem | ClassScheduleItem[]

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

export interface Instructor {
  id: number | string
  name: string
  role?: string
  profession?: string
  experience: number | string
  bio: string
  specialities?: string
  specialties?: string[]
  certifications?: string[]
  image: string
  image_url?: string
  created_at?: string
  updated_at?: string
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
  instructors: Instructor[]
  reviews: Review[]
  isLoadingFlats: boolean
  isLoadingInstructors: boolean
  isLoadingReviews: boolean
  isInitialLoading: boolean
  refetchFlats: () => Promise<void>
  refetchInstructors: () => Promise<void>
  refetchReviews: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [flats, setFlats] = useState<Flat[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoadingFlats, setIsLoadingFlats] = useState(true)
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(true)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const fetchFlats = async () => {
    try {
      setIsLoadingFlats(true)
      const { data } = await axiosInstance.get("/api/v1/flats/all")
      if (data?.success && data?.flats) {
        setFlats(data.flats)
      }
    } catch (err) {
      console.error("Error fetching flats:", err)
    } finally {
      setIsLoadingFlats(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      setIsLoadingInstructors(true)
      const { data } = await axiosInstance.get("/api/instructors")
      if (data?.status && data?.data) {
        setInstructors(data.data)
      }
    } catch (err) {
      console.error("Error fetching instructors:", err)
    } finally {
      setIsLoadingInstructors(false)
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
        setIsLoadingInstructors(false)
        setIsLoadingReviews(false)
        return
      }

      await Promise.all([fetchFlats(), fetchInstructors(), fetchReviews()])
      setIsInitialLoading(false)
    }

    fetchAllData()
  }, [pathname])

  const value: AppContextType = {
    flats,
    instructors,
    reviews,
    isLoadingFlats,
    isLoadingInstructors,
    isLoadingReviews,
    isInitialLoading,
    refetchFlats: fetchFlats,
    refetchInstructors: fetchInstructors,
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
