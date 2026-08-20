"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"
import { CalendarX, Clock, RefreshCw, Mail, Phone, MapPin, AlertCircle, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function CancellationPolicyClient() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <Hero
                title="Cancellation & Refund Policy"
                description="Transparent, simple, and flexible booking cancellation guidelines for your stay at Himalayan Aama."
                image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
            />

            {/* H1 Title & Intro */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                        Booking Flexibility
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                        Cancellation & Refund Policy – <span className="text-blue-600">Himalayan Aama</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium text-left pt-4">
                        At Himalayan Aama, we aim to make booking a self-catering 1BHK apartment in Lakeside, Pokhara simple, flexible, and transparent. Our cancellation and refund policy ensures guests can plan their stay confidently while reflecting the manual booking request system on our website.
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl space-y-12">

                    {/* Booking Requests (H2) */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-4">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Booking Requests</h2>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            All bookings are handled via booking request forms on our website. Guests select dates, submit their details, and our admin reviews and confirms availability. Since online payment is not collected upfront, cancellations are primarily about adjusting confirmed bookings.
                        </p>
                    </Card>

                    {/* Cancellation Policy (H2) */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <CalendarX className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Cancellation Policy</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-100 space-y-3">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                                    7+
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">7+ Days Before Check-in</h3>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                    Guests may cancel by contacting us via email or phone and receive full cancellation confirmation.
                                </p>
                            </div>

                            <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100 space-y-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                                    3-6
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">3–6 Days Before Check-in</h3>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                    Guests may cancel with 50% consideration, which will reflect any pre-approved payment arrangements.
                                </p>
                            </div>

                            <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-100 space-y-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                                    &lt;3
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Under 3 Days Before Check-in</h3>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                    Cancellation may not be accommodated due to limited notice, and admin approval is required.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                <strong>Note:</strong> If guests have already made any advance payment or deposit (optional, per arrangement), refunds are processed manually according to the above schedule.
                            </p>
                        </div>
                    </Card>

                    {/* How to Cancel (H2) & Refund Process (H2) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">How to Cancel</h2>
                            </div>
                            <p className="text-gray-600 font-medium text-base">
                                To cancel a booking request or confirmed stay:
                            </p>
                            <ol className="space-y-3 text-base text-gray-700 font-medium list-decimal pl-5">
                                <li>Contact us at <a href="mailto:info@himalayanAama.com" className="text-blue-600 font-bold underline">info@himalayanAama.com</a> or via phone/WhatsApp.</li>
                                <li>Provide your booking ID, name, and check-in dates.</li>
                                <li>Our team will confirm the cancellation and update the calendar in the admin portal.</li>
                            </ol>
                        </Card>

                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <RefreshCw className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Refund Process</h2>
                            </div>
                            <div className="space-y-3 text-base text-gray-600 font-medium leading-relaxed">
                                <p>
                                    Refunds (if applicable) are processed manually by admin and typically take <strong>5–7 business days</strong>.
                                </p>
                                <p>
                                    Any bank or transaction processing time may vary depending on your payment provider.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Changes to Booking (H2) */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-4">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Changes to Booking</h2>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed font-medium">
                            If you wish to modify your booking dates, contact us as soon as possible. Modifications are subject to availability, and the admin will update the booking status in the portal.
                        </p>
                    </Card>

                    {/* Contact for Assistance (H2) */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Contact for Assistance</h2>
                            <p className="text-blue-100 text-lg font-medium">
                                For any questions or concerns regarding cancellations, refunds, or booking changes:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <Mail className="h-6 w-6 text-blue-200 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">Email</span>
                                    <a href="mailto:info@himalayanAama.com" className="font-bold text-white hover:underline text-sm">
                                        info@himalayanAama.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <Phone className="h-6 w-6 text-blue-200 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">Phone</span>
                                    <a href="tel:+9779816685279" className="font-bold text-white hover:underline text-sm">
                                        +977 9816685279
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <MapPin className="h-6 w-6 text-blue-200 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">Address</span>
                                    <span className="font-bold text-white text-sm">Street No. 16, Lakeside, Pokhara</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 text-center">
                            <p className="text-blue-100 text-sm font-medium italic">
                                At Himalayan Aama, we are committed to providing a stress-free, BBQ-friendly self-catering stay in Pokhara, giving our guests peace of mind and the flexibility they need when planning their trip.
                            </p>
                        </div>
                    </Card>

                </div>
            </section>

            <Footer />
        </div>
    )
}
