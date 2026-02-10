"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Calendar, Users, MessageSquare, MapPin, Sparkles } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Image from "next/image"
import { useApp } from "@/context/AppContext"

interface Flat {
    _id: string
    flatName: string
    location: string
    price: number
    imagesUri: string[]
}

interface ApartmentBookingModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    flat: Flat | null
}

export function ApartmentBookingModal({ open, onOpenChange, flat }: ApartmentBookingModalProps) {
    const { offers } = useApp()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        checkInDate: "",
        checkOutDate: "",
        guests: "1",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!flat) return

        try {
            setIsSubmitting(true)

            const bookingData = {
                userName: formData.name,
                email: formData.email,
                phone: formData.phone,
                flat: flat._id,
                startDate: formData.checkInDate,
                endDate: formData.checkOutDate || formData.checkInDate, // Fallback
                participants: parseInt(formData.guests),
                message: formData.message
            }

            const { data } = await axiosInstance.post("/api/v1/bookings", bookingData)

            if (data.status || data.success) {
                toast.success("Booking inquiry sent successfully!")
                onOpenChange(false)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    checkInDate: "",
                    checkOutDate: "",
                    guests: "1",
                    message: ""
                })
            } else {
                toast.error(data.message || "Failed to send inquiry")
            }
        } catch (err) {
            console.error(err)
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!flat) return null

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
    const imageSrc = flat.imagesUri && flat.imagesUri.length > 0
        ? (flat.imagesUri[0].startsWith("http") ? flat.imagesUri[0] : `${BACKEND}/images/${flat.imagesUri[0]}`)
        : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2138&auto=format&fit=crop";

    const activeOffer = offers.find(o =>
        (typeof o.flat === 'string' ? o.flat === flat._id : o.flat?._id === flat._id)
    );
    const discountedPrice = activeOffer
        ? Math.round(flat.price * (1 - activeOffer.discountPercentage / 100))
        : flat.price;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none rounded-[40px] shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-5 h-full">
                    {/* Sidebar Image */}
                    <div className="hidden md:block md:col-span-2 relative">
                        <Image
                            src={imageSrc}
                            alt={flat.flatName}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                            <div className="text-white space-y-2">
                                <h3 className="text-2xl font-bold leading-tight">{flat.flatName}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black">${discountedPrice}</span>
                                        {activeOffer && (
                                            <span className="text-[10px] line-through opacity-60">Was ${flat.price}</span>
                                        )}
                                    </div>
                                    <div className="h-8 w-[1px] bg-white/20" />
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/80 uppercase tracking-widest">
                                        <MapPin className="h-3 w-3" />
                                        <span>{flat.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-3 p-8 sm:p-10 bg-white">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                <Sparkles className="h-6 w-6 text-blue-500" />
                                <span>Inquire Now</span>
                            </DialogTitle>
                            <p className="text-gray-500 font-medium text-sm mt-2">Perfect for long-term comfort in Pokhara.</p>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</Label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Jane Doe"
                                        className="h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone</Label>
                                    <Input
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+977"
                                        className="h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                                <Input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className="h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Check-in</Label>
                                    <div className="relative">
                                        <Input
                                            type="date"
                                            required
                                            value={formData.checkInDate}
                                            onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                            className="h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium appearance-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Guests</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        className="h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</Label>
                                <Input
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Your requirements..."
                                    className="h-12 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : "Request Reservation"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
