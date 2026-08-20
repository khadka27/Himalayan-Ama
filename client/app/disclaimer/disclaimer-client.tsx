"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"
import { AlertCircle, Home, CreditCard, Info, UserCheck, ShieldAlert, Mail, Phone, MapPin } from "lucide-react"

export default function DisclaimerPageClient() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <Hero
                title="Disclaimer & Guest Information"
                description="Important information regarding the use of our self-catering 1BHK apartment in Lakeside, Pokhara."
                image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop"
            />

            {/* H1 Main Title & Welcome */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                        Legal Information
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                        Disclaimer & <span className="text-blue-600">Guest Information</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium text-left pt-4">
                        Welcome to Himalayan Aama, a peaceful self-catering 1BHK apartment in Lakeside, Pokhara. By using our website and staying at our property, you agree to the following terms and understand the scope of our responsibilities.
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl space-y-12">

                    {/* Use of the Apartment */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Home className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Use of the Apartment</h2>
                        </div>
                        <ul className="space-y-4 text-gray-600 text-lg leading-relaxed font-medium">
                            <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mt-3 shrink-0" />
                                <span>Guests stay in a private 1BHK apartment with a self-catering kitchen, living area, bedroom, bathroom, and BBQ-friendly outdoor space.</span>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mt-3 shrink-0" />
                                <span>BBQ and outdoor activities are allowed in the compound. Guests must follow safety precautions and supervise children at all times.</span>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mt-3 shrink-0" />
                                <span>Himalayan Aama is not responsible for accidents, injuries, or damages that occur during use of the apartment or amenities.</span>
                            </li>
                        </ul>
                    </Card>

                    {/* Booking & Payments */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Booking & Payments</h2>
                        </div>
                        <ul className="space-y-3 text-base text-gray-700 font-medium">
                            <li className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <span>Bookings are request-based; availability is confirmed manually by the admin.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <span>No instant payment is collected through the website in version 1.0.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                <span>Himalayan Aama is not liable for any indirect losses, delays, or changes in travel plans related to booking requests.</span>
                            </li>
                        </ul>
                    </Card>

                    {/* Accuracy of Information & Personal Responsibility */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Info className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Accuracy of Information</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                We strive to provide accurate information about the apartment, photos, amenities, and location near Phewa Lake, Lakeside, Pokhara.
                            </p>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                The admin may update availability, offers, or policies, and website content may change without prior notice.
                            </p>
                        </Card>

                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Personal Responsibility</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Guests are responsible for their own safety, belongings, and cooking activities during their stay.
                            </p>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Any damages to the apartment or facilities caused by guests must be reported immediately. Charges may apply for repairs.
                            </p>
                        </Card>
                    </div>

                    {/* Limitation of Liability */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <ShieldAlert className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Limitation of Liability</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Himalayan Aama, its staff, and affiliates do not accept liability for loss, injury, or inconvenience arising from staying at the property, including but not limited to accidents, natural events, or miscommunication.
                        </p>
                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0" />
                            <span className="text-sm font-bold text-gray-800">Guests are encouraged to purchase travel insurance for additional protection.</span>
                        </div>
                    </Card>

                    {/* Contact */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Contact</h2>
                            <p className="text-blue-100 text-lg font-medium">
                                For any questions regarding this disclaimer or your stay:
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">Phone / WhatsApp</span>
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
                                Staying at Himalayan Aama means choosing a comfortable, private, and BBQ-friendly self-catering apartment near Phewa Lake. Please enjoy your stay responsibly and safely.
                            </p>
                        </div>
                    </Card>

                </div>
            </section>

            <Footer />
        </div>
    )
}
