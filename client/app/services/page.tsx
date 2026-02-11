"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"
import Hero from "@/components/hero"
import {
    Wifi,
    ParkingCircle,
    Utensils,
    Waves,
    Flame,
    Refrigerator,
    ChefHat,
    CheckCircle2,
    Sparkles,
    Check,
    Coffee,
    Loader2
} from "lucide-react"
import Image from "next/image"
import axiosInstance from "@/services/axios-instance"

const iconsMap: any = {
    Wifi, Utensils, ParkingCircle, Waves, Flame, Refrigerator, ChefHat, Sparkles
}

const fallbackAmenities = [
    {
        title: "Designer Kitchen",
        description: "Fully equipped modern kitchen with premium appliances, perfect for long-term stays and culinary enthusiasts.",
        image: "https://images.unsplash.com/photo-1556911220-e152748a7f8b?q=80&w=2070&auto=format&fit=crop",
        icon: "ChefHat",
        features: ["Induction Cooktop", "Oven & Microwave", "Electric Kettle", "Toaster"]
    },
    {
        title: "Complete Utensils",
        description: "A comprehensive set of high-quality cookware, dinnerware, and cutlery for all your dining needs.",
        image: "https://images.unsplash.com/photo-1590650213165-c1fef80648c4?q=80&w=2070&auto=format&fit=crop",
        icon: "Utensils",
        features: ["Premium Cutlery", "Non-stick Cookware", "Elegant Dinnerware", "Wine Glasses"]
    },
    {
        title: "High-Speed Connectivity",
        description: "Seamless high-speed WiFi coverage throughout the premises, ideal for remote work and entertainment.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop",
        icon: "Wifi",
        features: ["Dual-band Router", "Dedicated Line", "Multiple APs", "Work Desks"]
    },
    {
        title: "Lake Proximity",
        description: "Ideally located within walking distance to the serene Phewa Lake and the vibrant Lakeside market.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop",
        icon: "Waves",
        features: ["5 Min Walk", "Lakeside Access", "Boat Station Near", "Cafe Hub"]
    }
]

export default function ServicesPage() {
    const [amenities, setAmenities] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const { data } = await axiosInstance.get("/api/v1/services/active")
                if (data.success && data.services.length > 0) {
                    setAmenities(data.services)
                } else {
                    setAmenities(fallbackAmenities)
                }
            } catch (err) {
                console.error("Failed to fetch amenities, using fallbacks")
                setAmenities(fallbackAmenities)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAmenities()
    }, [])

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000"

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <Hero
                title="Service & Amenities"
                description="Experience a stay defined by convenience and thoughtful details. We provide everything you need for a comfortable Himalayan home."
                image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            />

            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <div className="py-20 text-center">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto text-blue-500" />
                            <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest">Loading Amenities...</p>
                        </div>
                    ) : (
                        <div className="space-y-32">
                            {amenities.map((item, index) => {
                                const Icon = iconsMap[item.icon] || Sparkles
                                const imageSrc = item.image
                                    ? (item.image.startsWith("http") ? item.image : `${BACKEND}/images/${item.image}`)
                                    : "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"

                                return (
                                    <motion.div
                                        key={item.title}
                                        className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <div className="flex-1 space-y-8">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest">
                                                    <Icon className="h-4 w-4" />
                                                    <span>Premium Amenity</span>
                                                </div>
                                                <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{item.title}</h2>
                                                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {item.features?.map((feature: string) => (
                                                    <div key={feature} className="flex items-center gap-3">
                                                        <div className="h-6 w-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                                            <Check className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="font-bold text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full relative">
                                            <div className="relative h-[400px] md:h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                                                <Image
                                                    src={imageSrc}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
                                            </div>
                                            <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} h-32 w-32 bg-white rounded-[40px] shadow-2xl hidden md:flex items-center justify-center border border-blue-50`}>
                                                <div className="text-center">
                                                    <Sparkles className="h-10 w-10 text-blue-500 mx-auto mb-1" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Elite</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Checklist Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        {/* What's Included */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    What's Included
                                </h3>
                                <p className="text-gray-500 font-medium">We provide these essentials to ensure your stay starts perfectly.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Fresh Linens & Towels",
                                    "Premium Toiletries",
                                    "Coffee, Tea & Sugar",
                                    "Basic Spices & Oil",
                                    "Gas & Electricity",
                                    "Property Maintenance",
                                    "Secure Storage",
                                    "Garbage Management"
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-white group hover:bg-green-50 hover:border-green-100 transition-all">
                                        <Check className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform" />
                                        <span className="font-bold text-gray-900">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What to Bring */}
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Coffee className="h-6 w-6" />
                                    </div>
                                    What to Bring
                                </h3>
                                <p className="text-gray-500 font-medium">Items you might want to bring for a more personalized experience.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Your Favorite Toiletries",
                                    "Specialty Groceries",
                                    "Reusable Water Bottle",
                                    "Lightweight Jacket",
                                    "Personal Electronics",
                                    "Comfortable Footwear",
                                    "Travel Insurance Docs",
                                    "Local Currency"
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-white group hover:bg-blue-50 hover:border-blue-100 transition-all">
                                        <div className="h-5 w-5 rounded-full border-2 border-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-500 group-hover:border-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            +
                                        </div>
                                        <span className="font-bold text-gray-900">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
