"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"
import { ShieldAlert, BookOpen, CreditCard, Sparkles, Clock, Ban, Phone } from "lucide-react"

export default function PoliciesPageClient() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            <Hero
                title="Rental Policies"
                description="Transparency and fairness are at the heart of our community. Please review our guidelines for a smooth stay."
                image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop"
            />

            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

                        <div className="lg:col-span-12 xl:col-span-8 space-y-20">
                            {/* Booking Section */}
                            <div className="space-y-10 group">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <BookOpen className="h-7 w-7" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Booking & Cancellation</h2>
                                </div>
                                <div className="h-1.5 w-20 bg-blue-500 rounded-full" />
                                <div className="space-y-8 text-xl text-gray-600 font-medium leading-loose">
                                    <p>
                                        We strive to make the booking process as seamless as possible. All reservations are subject to our tiered cancellation policy to ensure fairness for both travelers and property hosts.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { title: "Standard", desc: "Full refund 14+ days before check-in.", icon: Sparkles, color: "text-green-500" },
                                            { title: "Flexible", desc: "50% refund between 7-14 days.", icon: Clock, color: "text-blue-400" },
                                            { title: "Non-Refundable", desc: "Cancellations under 7 days.", icon: Ban, color: "text-red-400" }
                                        ].map((item, i) => (
                                            <Card key={i} className="p-8 rounded-3xl border border-gray-100 shadow-sm bg-slate-50">
                                                <item.icon className={`h-8 w-8 ${item.color} mb-4`} />
                                                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                                                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="space-y-10 group">
                                <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <CreditCard className="h-7 w-7" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Security Deposits</h2>
                                </div>
                                <div className="h-1.5 w-20 bg-blue-500 rounded-full" />
                                <div className="space-y-8 text-xl text-gray-600 font-medium leading-loose">
                                    <p>
                                        To maintain our high standards of luxury, a security deposit is required for all stays. This fund is held to cover any potential damages or excessive cleaning requirements.
                                    </p>

                                    <div className="space-y-4">
                                        {[
                                            "Short-term Stays (under 30 days): One week's rent deposit.",
                                            "Long-term Rentals (30+ days): One month's rent deposit.",
                                            "Refunds: Processed automatically within 7 business days of an inspection."
                                        ].map((text, i) => (
                                            <div key={i} className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl border border-white">
                                                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2.5 shrink-0" />
                                                <span className="text-lg">{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-12 xl:col-span-4 space-y-12">
                            <Card className="p-12 bg-white rounded-[40px] border border-gray-100 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-blue-500" />
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <ShieldAlert className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">House Standards</h3>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { label: "Check-in", val: "2:00 PM onwards" },
                                        { label: "Check-out", val: "Until 11:00 AM" },
                                        { label: "Quiet Hours", val: "10 PM - 7 AM" },
                                        { label: "Smoking", val: "Outdoor Areas Only", intense: true }
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group/item">
                                            <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">{item.label}</span>
                                            <span className={`font-bold text-gray-900 ${item.intense ? 'text-red-500' : ''}`}>{item.val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 h-1.5 w-full bg-slate-50 rounded-full" />
                            </Card>

                            <Card className="p-12 bg-blue-500 text-white rounded-[40px] border-none shadow-2xl relative overflow-hidden group">
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 translate-x-1/2 blur-2xl" />
                                <h3 className="text-2xl font-bold mb-6 tracking-tight">Need Clarification?</h3>
                                <p className="mb-10 text-blue-50 font-medium italic leading-relaxed">
                                    "We believe in hospitality with heart. If any part of our policy is unclear, our team is happy to discuss it with you."
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 group/link cursor-pointer">
                                        <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center group-hover/link:bg-white/20 transition-all">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Call Support</span>
                                            <span className="font-bold">+977 9816685279</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
