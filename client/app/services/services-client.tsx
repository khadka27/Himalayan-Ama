"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"
import Hero from "@/components/hero"
import { Card } from "@/components/ui/card"
import {
    Wifi,
    Utensils,
    Flame,
    Refrigerator,
    ChefHat,
    CheckCircle2,
    Sparkles,
    Check,
    Coffee,
    Loader2,
    Heart,
    Wrench,
    MapPin,
    Building2,
    Compass,
    Shield,
    Plus,
    ShowerHead,
    Lock,
    Trash2,
    Zap,
    Shirt,
    ShoppingBag,
    Footprints,
    FileText,
    Coins,
    Glasses
} from "lucide-react"
import Image from "next/image"
import axiosInstance from "@/services/axios-instance"

const iconsMap: any = {
    Wifi, Utensils, Flame, Refrigerator, ChefHat, Sparkles,
    Heart, Wrench, MapPin, Building2, Compass, Shield, ShowerHead, Lock, Trash2, Zap
}

const detailedServices = [
    {
        category: "COMFORT & WELLNESS",
        title: "Free Access to the Yoga Hall",
        description: "Start your morning with movement or slow down after exploring Pokhara. Guests at Himalayan Aama enjoy free access to the yoga hall, giving you a peaceful space to stretch, practice yoga, meditate, or simply relax.",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop",
        icon: "Heart",
        features: [
            "Complimentary guest access",
            "Peaceful space for yoga and meditation",
            "Useful before or after trekking",
            "Easy way to maintain your wellness routine"
        ]
    },
    {
        category: "A WARM WELCOME",
        title: "Your First Meal Is On Us",
        description: "After a long journey, settling into your Lakeside Pokhara stay should feel easy. Guests receive a complimentary first-day meal, giving you time to relax before heading out to explore the city.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
        icon: "Utensils",
        features: [
            "First-day meal complimentary",
            "Thoughtful welcome for every stay",
            "Convenient after a long journey",
            "Settle in before exploring Pokhara"
        ]
    },
    {
        category: "SELF-CATERING LIVING",
        title: "Cook, Eat & Stay Your Way",
        description: "Enjoy the flexibility of a self-catering apartment in Pokhara with kitchen facilities that let you prepare meals on your own schedule. Bring your own groceries, prepare breakfast before sightseeing, or cook a simple meal after a long day around Lakeside.",
        image: "https://images.unsplash.com/photo-1556911220-e152748a7f8b?q=80&w=2070&auto=format&fit=crop",
        icon: "ChefHat",
        features: [
            "Self-catering kitchen",
            "Kitchen utensils",
            "Refrigerator",
            "Freedom to prepare your own meals"
        ]
    },
    {
        category: "OUTDOOR MOMENTS",
        title: "Enjoy a BBQ in the Compound",
        description: "Looking for a relaxed evening without heading out again? Guests can enjoy a BBQ in the compound, making it easy to prepare food and spend time together at your own pace. It is a simple way to enjoy a slower evening during your apartment stay in Pokhara.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
        icon: "Flame",
        features: [
            "BBQ space in the compound",
            "Ideal for relaxed evenings",
            "Prepare your own food",
            "Enjoy more time at the property"
        ]
    },
    {
        category: "EVERYDAY SUPPORT",
        title: "Plumbing Service",
        description: "A small maintenance issue should not interrupt your stay. Plumbing assistance is available for guests who experience plumbing-related concerns during their time at the apartment.",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
        icon: "Wrench",
        features: [
            "Plumbing assistance",
            "Support when issues arise",
            "Help with apartment-related concerns",
            "More comfortable stay experience"
        ]
    },
    {
        category: "ESSENTIAL APARTMENT SUPPORT",
        title: "Gas Service",
        description: "Guests using the kitchen can receive assistance with gas-related concerns during their stay. This support helps make self-catering easier, especially for travelers staying several days and using the apartment kitchen regularly.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
        icon: "Flame",
        features: [
            "Gas service assistance",
            "Support for self-cooking guests",
            "Help with apartment-related concerns",
            "Convenient longer-stay support"
        ]
    },
    {
        category: "HERE WHEN YOU NEED US",
        title: "Assistance With Apartment Issues",
        description: "If something in the apartment needs attention, you do not have to manage it alone. Guests can contact the team for assistance with basic maintenance, utilities, or other apartment-related concerns during their stay.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        icon: "Shield",
        features: [
            "Apartment-related assistance",
            "Guest support when needed",
            "Help with basic maintenance concerns",
            "More comfortable and convenient stay"
        ]
    },
    {
        category: "EXPLORE WITH EASE",
        title: "A Convenient Base in Lakeside Pokhara",
        description: "Himalayan Aama offers a private apartment stay in Lakeside Pokhara, giving travelers a convenient base for exploring the city while enjoying the independence of apartment-style accommodation. Whether you are visiting tourist attractions, preparing for trekking, or simply spending a few relaxed days near Lakeside, the location helps you experience Pokhara at your own pace.",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070&auto=format&fit=crop",
        icon: "MapPin",
        features: [
            "Convenient Lakeside location",
            "Easy access to nearby attractions",
            "Comfortable base for exploring Pokhara",
            "Suitable for short and longer stays"
        ]
    },
    {
        category: "15-MINUTE WALK",
        title: "Discover a Nearby Monastery",
        description: "A nearby monastery is approximately a 15-minute walk from Himalayan Aama, giving guests an easy way to experience a quieter and more reflective side of the local area. It can be a peaceful addition to a morning walk or a relaxed evening around Lakeside.",
        image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=2070&auto=format&fit=crop",
        icon: "Building2",
        features: [
            "Approximately 15-minute walk",
            "Easy to explore independently",
            "Peaceful nearby experience",
            "Cultural and spiritual surroundings"
        ]
    },
    {
        category: "YOUR STAY, YOUR EXPERIENCE",
        title: "Tourist Places Within Easy Reach",
        description: "Staying in Lakeside gives you the flexibility to explore many of Pokhara’s popular places without turning every day into a complicated itinerary. Use Himalayan Aama as a comfortable base, then choose whether you want sightseeing, adventure, local food, cultural experiences, or simply a slower day at the apartment.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        icon: "Compass",
        features: [
            "Tourist places easily accessible",
            "Convenient starting point for exploring",
            "Flexible for different travel styles",
            "Ideal base for experiencing Pokhara"
        ]
    }
]

const whatsIncludedList = [
    { title: "Fresh Linens & Towels", desc: "Fresh essentials for a clean and comfortable apartment stay." },
    { title: "Premium Toiletries", desc: "Useful everyday toiletries to help you settle in more easily." },
    { title: "Free Wi-Fi", desc: "Stay connected throughout your visit with complimentary Wi-Fi, useful for browsing, planning your trip, keeping in touch, or working remotely during your stay in Pokhara." },
    { title: "Hot Shower", desc: "Enjoy a hot shower after a day of sightseeing, trekking, or exploring Lakeside. It is a simple comfort that can feel especially welcome after outdoor activities or a long journey." },
    { title: "Coffee, Tea & Sugar", desc: "Simple refreshments you can enjoy whenever you want." },
    { title: "Basic Spices & Oil", desc: "Helpful kitchen essentials for guests planning to prepare their own meals." },
    { title: "Gas & Electricity", desc: "Essential utilities to support a comfortable self-catering stay in Pokhara." },
    { title: "Property Maintenance", desc: "Practical assistance to help keep the apartment comfortable and functional." },
    { title: "Secure Storage", desc: "Convenient space for keeping your belongings during your stay." },
    { title: "Garbage Management", desc: "A cleaner and more convenient environment throughout your time at the property." }
]

const whatsToBringList = [
    { title: "Your Favorite Toiletries", desc: "Bring any personal products you prefer to use during your stay." },
    { title: "Specialty Groceries", desc: "Pick up your favorite ingredients if you plan to cook meals in the apartment." },
    { title: "Reusable Water Bottle", desc: "Useful while walking around Lakeside, sightseeing, or preparing for outdoor activities." },
    { title: "Lightweight Jacket", desc: "Pokhara weather can vary, so carrying an extra layer can be useful during your trip." },
    { title: "Personal Electronics", desc: "Bring your phone, camera, laptop, chargers, or other devices you may need." },
    { title: "Comfortable Footwear", desc: "Helpful for Lakeside walks, local sightseeing, and exploring nearby places." },
    { title: "Travel Insurance Documents", desc: "Keep important travel and insurance information easily accessible." },
    { title: "Local Currency", desc: "Useful for small purchases, food, local transport, and nearby experiences." }
]

export default function ServicesPage() {
    const [amenities, setAmenities] = useState<any[]>(detailedServices)
    const [isLoading, setIsLoading] = useState(false)

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000"

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <Hero
                title="Services & Amenities in Lakeside Pokhara"
                description="Comfort that makes you feel at home. Experience apartment-style independence with practical guest support."
                image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            />

            {/* H1 Title & Intro */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                        Apartment Amenities
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                        Services & Amenities in <span className="text-blue-600">Lakeside Pokhara</span>
                    </h1>
                    <h2 className="text-2xl font-bold text-gray-800 pt-2">
                        Comfort That Makes You Feel at Home
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium text-left pt-2">
                        At Himalayan Aama, we believe a comfortable stay in Pokhara should give you more than just a place to sleep. It should give you the freedom to live at your own pace, prepare your own meals, relax when you need to, and get support if something in the apartment needs attention.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed font-medium text-left">
                        From a self-catering kitchen in Pokhara and BBQ space to a complimentary first-day meal and free yoga hall access, Himalayan Aama combines apartment-style independence with practical guest support in Lakeside Pokhara.
                    </p>
                </div>
            </section>

            {/* Amenities Cards Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="space-y-28">
                        {amenities.map((item, index) => {
                            const Icon = iconsMap[item.icon] || Sparkles
                            const imageSrc = item.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"

                            return (
                                <motion.div
                                    key={index}
                                    className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.7 }}
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className="space-y-3">
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 font-bold text-xs uppercase tracking-widest">
                                                <Icon className="h-4 w-4" />
                                                <span>{item.category || "Amenity"}</span>
                                            </span>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{item.title}</h2>
                                            <p className="text-lg text-gray-600 font-medium leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                            {item.features?.map((feature: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
                                                    <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                        <Check className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="font-bold text-gray-800 text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full relative">
                                        <div className="relative h-[350px] md:h-[420px] w-full rounded-[36px] overflow-hidden shadow-xl border-4 border-white group">
                                            <Image
                                                src={imageSrc}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Checklist Section: What's Included & What to Bring */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        
                        {/* What's Included */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">What’s Included</h2>
                                </div>
                                <p className="text-gray-500 font-medium text-base">
                                    We provide practical essentials to help make your stay in Pokhara comfortable from the moment you arrive.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {whatsIncludedList.map((item, idx) => (
                                    <Card key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-all space-y-1">
                                        <div className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                                            <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium pl-8 leading-relaxed">{item.desc}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* What to Bring */}
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <Coffee className="h-6 w-6" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">What to Bring</h2>
                                </div>
                                <p className="text-gray-500 font-medium text-base">
                                    A few personal essentials can make your Lakeside Pokhara accommodation even more comfortable.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {whatsToBringList.map((item, idx) => (
                                    <Card key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 hover:border-blue-100 transition-all space-y-1">
                                        <div className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                +
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium pl-8 leading-relaxed">{item.desc}</p>
                                    </Card>
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
