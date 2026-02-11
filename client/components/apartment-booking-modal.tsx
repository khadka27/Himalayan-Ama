"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Calendar as CalendarIcon, Users, MessageSquare, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react"
import axiosInstance from "@/services/axios-instance"
import { toast } from "sonner"
import Image from "next/image"
import { useApp } from "@/context/AppContext"
import { Calendar } from "@/components/ui/calendar"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"
import { addDays, format, isWithinInterval, parseISO, differenceInDays } from "date-fns"
import { useEffect } from "react"

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
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [existingBookings, setExistingBookings] = useState<any[]>([])
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        guests: "1",
        message: ""
    })
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (open && flat) {
            fetchBookings()
        }
    }, [open, flat])

    const fetchBookings = async () => {
        try {
            const { data } = await axiosInstance.get(`/api/v1/bookings/flat/${flat?._id}`)
            if (data.success) {
                setExistingBookings(data.bookings)
            }
        } catch (err) {
            console.error("Failed to fetch bookings", err)
        }
    }

    const disabledDays = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Pass a custom modifier to distinguishing between past and reserved
        const isPast = date < today
        const isReserved = existingBookings.some(booking => {
            if (!booking.isVerified) return false
            const start = parseISO(booking.startDate)
            const end = parseISO(booking.endDate)
            return isWithinInterval(date, { start, end })
        })

        if (isPast) return true
        if (isReserved) return true
        return false
    }

    const modifiers = {
        past: (date: Date) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return date < today
        },
        reserved: (date: Date) => {
            return existingBookings.some(booking => {
                if (!booking.isVerified) return false
                const start = parseISO(booking.startDate)
                const end = parseISO(booking.endDate)
                return isWithinInterval(date, { start, end })
            })
        }
    }

    const modifierClassNames = {
        past: "text-slate-300 opacity-40 cursor-not-allowed",
        reserved: "bg-slate-100 text-slate-600 font-bold cursor-not-allowed opacity-100 italic"
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!flat) return

        try {
            if (!dateRange?.from || !dateRange?.to) {
                toast.error("Please select a date range")
                return
            }

            // Check if selected range overlaps ANY verified booking
            const hasOverlap = existingBookings.some(booking => {
                if (!booking.isVerified) return false;
                const start = parseISO(booking.startDate);
                const end = parseISO(booking.endDate);

                // standard overlap check: (start1 < end2) && (end1 > start2)
                return (dateRange.from! < end) && (dateRange.to! > start);
            });

            if (hasOverlap) {
                toast.error("Your selected dates overlap with an existing booking. Please pick another range.");
                return;
            }

            setIsSubmitting(true)

            const bookingData = {
                userName: formData.name,
                email: formData.email,
                phone: formData.phone,
                flat: flat._id,
                startDate: dateRange.from.toISOString(),
                endDate: dateRange.to.toISOString(),
                participants: parseInt(formData.guests),
                message: formData.message
            }

            const { data } = await axiosInstance.post("/api/v1/bookings", bookingData)

            if (data.status || data.success) {
                toast.success("Booking inquiry sent successfully!")

                // WhatsApp Redirection
                const phoneNumber = "9779816685279";
                const message = `Namaste! I just submitted a booking inquiry for *${flat.flatName}*.%0A%0ADates: ${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}%0AGuests: ${formData.guests}%0AName: ${formData.name}%0A%0APlease confirm my stay. Thank you!`;
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                window.open(whatsappUrl, '_blank');

                onOpenChange(false)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    guests: "1",
                    message: ""
                })
                setDateRange(undefined)
                setStep(1)
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

    const numberOfNights = dateRange?.from && dateRange?.to
        ? differenceInDays(dateRange.to, dateRange.from)
        : 0;
    const totalPrice = numberOfNights * discountedPrice;

    const hasOverlapSelection = dateRange?.from && dateRange?.to && existingBookings.some(booking => {
        if (!booking.isVerified) return false;
        const start = parseISO(booking.startDate);
        const end = parseISO(booking.endDate);
        return (dateRange.from! < end) && (dateRange.to! > start);
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-none rounded-[40px] shadow-2xl h-[90vh] md:h-auto overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
                    {/* Calendar & Form Section */}
                    <div className="md:col-span-9 p-6 sm:p-8 bg-white flex flex-col overflow-hidden">
                        <div className="w-full max-w-2xl mx-auto mb-4">
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-blue-500" />
                                    <span>{step === 1 ? "Book Your Stay" : "Guest Information"}</span>
                                </DialogTitle>
                            </DialogHeader>

                            {/* Step Indicator */}
                            <div className="flex items-center gap-4 mb-2">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${step === 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-blue-50 text-blue-600"}`}>
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step === 1 ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>1</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Dates</span>
                                </div>
                                <div className="h-[1px] w-6 bg-gray-100 rounded-full" />
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${step === 2 ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-gray-50 text-gray-400"}`}>
                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ${step === 2 ? "bg-white text-blue-600" : "bg-gray-400 text-white"}`}>2</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto pr-2 custom-scrollbar">
                            {step === 1 ? (
                                /* Step 1: Calendar */
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-4">
                                    <div className="space-y-4">
                                        <Calendar
                                            mode="range"
                                            selected={dateRange}
                                            onSelect={setDateRange as SelectRangeEventHandler}
                                            disabled={disabledDays}
                                            modifiers={modifiers}
                                            modifiersClassNames={modifierClassNames}
                                            className="rounded-[32px] border border-gray-100 p-4 bg-slate-50/50 shadow-inner w-full flex justify-center scale-95 origin-top"
                                            numberOfMonths={1}
                                        />

                                        <div className="flex flex-wrap gap-4 justify-center">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-slate-600" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Reserved</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selected</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-slate-300" />
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Past</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-[24px] border space-y-4 shadow-sm transition-colors duration-300 ${hasOverlapSelection ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"}`}>
                                        <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${hasOverlapSelection ? "text-red-900" : "text-blue-900"}`}>
                                            <CalendarIcon className="h-3 w-3" />
                                            {hasOverlapSelection ? "Conflict Detected" : "Selected Stay Window"}
                                        </h4>
                                        {dateRange?.from ? (
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className={`text-[8px] font-bold uppercase tracking-tighter ${hasOverlapSelection ? "text-red-400" : "text-blue-400"}`}>Check-in</p>
                                                    <p className={`text-base font-black leading-none ${hasOverlapSelection ? "text-red-900" : "text-blue-900"}`}>{format(dateRange.from, "PPP")}</p>
                                                </div>
                                                <ArrowRight size={20} className={hasOverlapSelection ? "text-red-300" : "text-blue-300"} />
                                                <div className="space-y-1 text-right">
                                                    <p className={`text-[8px] font-bold uppercase tracking-tighter ${hasOverlapSelection ? "text-red-400" : "text-blue-400"}`}>Check-out</p>
                                                    <p className={`text-base font-black leading-none ${hasOverlapSelection ? "text-red-900" : "text-blue-900"}`}>{dateRange.to ? format(dateRange.to, "PPP") : "Pick end date"}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm font-bold text-blue-400 italic">Please select arrival and departure dates.</p>
                                        )}

                                        {hasOverlapSelection && (
                                            <div className="p-3 bg-red-100/50 rounded-xl">
                                                <p className="text-[10px] font-bold text-red-600 leading-tight">
                                                    One or more days in your selection are already reserved. Please adjust your dates.
                                                </p>
                                            </div>
                                        )}

                                        {numberOfNights > 0 && !hasOverlapSelection && (
                                            <div className="pt-4 border-t border-blue-100 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">Total Estimate</p>
                                                    <p className="text-xs font-bold text-blue-900">{numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'} selected</p>
                                                </div>
                                                <p className="text-2xl font-black text-blue-600">Rs. {totalPrice}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Button
                                            onClick={() => {
                                                if (dateRange?.from && dateRange?.to) {
                                                    setStep(2)
                                                } else {
                                                    toast.error("Please select a date range first")
                                                }
                                            }}
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg uppercase tracking-widest group"
                                        >
                                            <span className="flex items-center gap-3">
                                                Continue to Details
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                /* Step 2: Form */
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 mb-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                                                <Input
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Guest Name"
                                                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold px-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number (optional)</Label>
                                                <Input
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="+977"
                                                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold px-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="example@gmail.com"
                                                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold px-6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Guests</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    required
                                                    value={formData.guests}
                                                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold px-6"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Extra Requirements</Label>
                                            <Input
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Message (optional)..."
                                                className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold px-6"
                                            />
                                        </div>

                                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setStep(1)}
                                                className="h-16 px-8 rounded-3xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase tracking-widest"
                                            >
                                                Go Back
                                            </Button>
                                            <Button type="submit" className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-100 transition-all text-xl uppercase tracking-widest group" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : (
                                                    <span className="flex items-center gap-3">
                                                        Confirm Booking
                                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                )}
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Secure Inquiry</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                            <span>Response within 24h</span>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Image (Details Last) */}
                    <div className="hidden md:block md:col-span-3 relative border-l border-gray-100">
                        <Image
                            src={imageSrc}
                            alt={flat.flatName}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                            <div className="text-white space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">Selected Property</p>
                                    <h3 className="text-3xl font-black leading-tight tracking-tighter">{flat.flatName}</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-1">Price per stay</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black">Rs. {discountedPrice}</span>
                                            {activeOffer && (
                                                <span className="text-sm line-through opacity-60 font-bold">Was Rs. {flat.price}</span>
                                            )}
                                        </div>
                                    </div>
                                    {totalPrice > 0 && (
                                        <div className="flex flex-col animate-in fade-in zoom-in-95 duration-500">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-300 mb-1">Total stay cost</span>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-blue-400">Rs. {totalPrice}</span>
                                                <span className="text-xs font-bold opacity-60">for {numberOfNights} nights</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="h-[2px] w-12 bg-blue-500 rounded-full" />
                                    <div className="flex items-center gap-2 text-xs font-bold text-white/90 uppercase tracking-widest leading-none">
                                        <MapPin className="h-3 w-3 text-blue-400" />
                                        <span>{flat.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
