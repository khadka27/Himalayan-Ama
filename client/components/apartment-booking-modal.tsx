"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Calendar, User, Mail, Phone } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Image from "next/image"

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

            // We can use the existing /api/bookings endpoint if we adapt the data, 
            // or /api/inquiries if valid. 
            // Let's assume we use /api/bookings but with a specific note or type.
            // Or better, just send an inquiry since real booking might need availability check.
            // The user wants "rent apartment". 
            // Let's try to hit /api/bookings with mapped fields.

            const bookingData = {
                userName: formData.name,
                userEmail: formData.email,
                phone: formData.phone,
                service_id: flat._id, // Using Flat ID as service ID
                fromDate: formData.checkInDate,
                toDate: formData.checkOutDate,
                participants: parseInt(formData.guests),
                price: flat.price, // Monthly price? Or calculated? Let's just pass base price.
                status: "pending",
                paymentType: "inquiry", // Mark as inquiry
                // Add apartment specific metadata if possible, or just put in notes/message
                pricing_tier_description: `Apartment Inquiry for ${flat.flatName}. Message: ${formData.message}`
            }

            const { data } = await axiosInstance.post("/api/bookings", bookingData)

            if (data.status || data.success) {
                toast.success("Booking inquiry sent successfully! We will contact you shortly.")
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
        : "/placeholder.svg";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif text-[#4A5D4C]">
                        Book {flat.flatName}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex gap-4 mb-4 border-b pb-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={imageSrc} alt={flat.flatName} fill className="object-cover" />
                    </div>
                    <div>
                        <h4 className="font-semibold">{flat.flatName}</h4>
                        <p className="text-sm text-gray-500">{flat.location}</p>
                        <p className="font-bold text-[#627A64] mt-1">${flat.price} <span className="text-xs font-normal text-gray-500">/ month</span></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="(123) 456-7890"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="checkIn">Check-in *</Label>
                            <Input
                                id="checkIn"
                                type="date"
                                required
                                value={formData.checkInDate}
                                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="checkOut">Check-out *</Label>
                            <Input
                                id="checkOut"
                                type="date"
                                required
                                value={formData.checkOutDate}
                                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="guests">Guests</Label>
                        <Input
                            id="guests"
                            type="number"
                            min="1"
                            required
                            value={formData.guests}
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Input
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Any special requests?"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-[#627A64] hover:bg-[#4A5D4C] text-white" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Inquiry...
                            </>
                        ) : (
                            "Send Inquiry"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
