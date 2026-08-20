"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"
import { FileText, Shield, CheckCircle2, UserCheck, AlertTriangle, Copyright, Lock, Scale, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function TermsPageClient() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <Hero
                title="Terms of Use"
                description="Please read these terms and conditions carefully before booking your stay with Himalayan Ama."
                image="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2070&auto=format&fit=crop"
            />

            {/* Main Title Section (H1) */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                        Legal Terms & Conditions
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                        Terms of Use – <span className="text-blue-600">Himalayan Ama</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium text-left pt-4">
                        Welcome to Himalayan Ama, a private self-catering 1BHK apartment in Lakeside Pokhara, designed for travelers seeking a peaceful, comfortable, and home-like stay near Phewa Lake. By using our website and submitting a booking request, you agree to the following terms and conditions.
                    </p>
                </div>
            </section>

            {/* Terms List Sections */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl space-y-12">

                    {/* 1. Scope of Services */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-4">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">1. Scope of Services</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 text-lg leading-relaxed font-medium">
                            <p>
                                Himalayan Ama provides a fully furnished apartment stay in Pokhara with kitchen facilities, BBQ space, and a private living environment suitable for couples, small families, and long stays.
                            </p>
                            <p>
                                Booking requests can be made through our website. All bookings are subject to availability and admin confirmation.
                            </p>
                        </div>
                    </Card>

                    {/* 2. Booking, Payment, and Cancellation */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">2. Booking, Payment, and Cancellation</h2>
                        </div>
                        <ul className="space-y-3 text-gray-700 text-base font-medium">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <span>All bookings are subject to availability.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <span>Guests must provide accurate details during the booking request process.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <span>Booking confirmation will be provided after review by the admin.</span>
                            </li>
                        </ul>

                        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-xl font-bold text-gray-900">Payment & Refund Policy</h3>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Booking payments, if taken as an advance or deposit, are non-refundable once the booking is confirmed. In case of cancellation, guests may request to transfer their booking to another date, subject to availability and approval.
                            </p>
                        </div>

                        <div className="space-y-4 bg-blue-50/60 p-6 rounded-2xl border border-blue-100">
                            <h3 className="text-xl font-bold text-gray-900">Transfer to Another Guest</h3>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                If a guest is unable to stay, they may transfer their booking to a friend, family member, or known person. The guest must inform Himalayan Ama in advance with the updated guest details. The new guest must follow all booking terms, house rules, and identification requirements. This option allows flexibility while maintaining the non-refundable booking policy.
                            </p>
                        </div>

                        <p className="text-gray-600 italic text-base font-medium">
                            Himalayan Ama reserves the right to refuse or cancel bookings that violate policies or local regulations.
                        </p>
                    </Card>

                    {/* 3. Guest Responsibilities */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">3. Guest Responsibilities</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Guests staying at our self-catering apartment in Lakeside Pokhara are expected to:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Respect the apartment property, furniture, and amenities.",
                                "Maintain a peaceful and respectful environment.",
                                "Use kitchen and BBQ facilities responsibly.",
                                "Follow all house rules and local regulations.",
                                "Avoid illegal activities or disturbances."
                            ].map((rule, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                    <span className="text-base text-gray-800 font-bold">{rule}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-red-500 font-bold text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                            Failure to comply may result in termination of stay without refund.
                        </p>

                        <div className="pt-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Damages and Loss of Property</h3>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Guests are responsible for any damage or loss of property during their stay. The current value of damaged or lost items will be charged accordingly.
                            </p>
                        </div>
                    </Card>

                    {/* 4. Limitation of Liability */}
                    <Card className="p-8 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">4. Limitation of Liability</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            Himalayan Ama is not responsible for:
                        </p>
                        <ul className="space-y-3 text-base text-gray-700 font-medium">
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                <span>Personal injuries, accidents, or health-related incidents.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                <span>Loss, theft, or damage of personal belongings.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                <span>Travel disruptions, delays, or unforeseen circumstances.</span>
                            </li>
                        </ul>
                        <p className="text-gray-600 text-base font-medium leading-relaxed pt-2">
                            Guests accept full responsibility for their actions while staying in our private apartment near Phewa Lake.
                        </p>
                    </Card>

                    {/* 5. Intellectual Property & 6. Privacy and Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Copyright className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">5. Intellectual Property</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                All website content including images, text, and branding is the property of Himalayan Ama and is protected by copyright laws. Unauthorized use or reproduction is strictly prohibited.
                            </p>
                        </Card>

                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">6. Privacy and Data</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                We respect your privacy. Personal information such as name, phone number, and email is collected only for booking, communication, and guest services. Please refer to our{" "}
                                <Link href="/policies" className="text-blue-600 font-bold underline">
                                    Privacy Policy
                                </Link>{" "}
                                for more details.
                            </p>
                        </Card>
                    </div>

                    {/* 7. Changes to Terms & 8. Governing Law */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FileText className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">7. Changes to Terms</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Himalayan Ama reserves the right to update or modify these terms at any time. Continued use of the website indicates acceptance of the updated terms.
                            </p>
                        </Card>

                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Scale className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">8. Governing Law</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                These Terms of Use are governed by the laws of Nepal. Any disputes will be handled under the jurisdiction of Nepal.
                            </p>
                        </Card>
                    </div>

                    {/* 9. Contact Us */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">9. Contact Us</h2>
                            <p className="text-blue-100 text-lg font-medium">
                                If you have any questions regarding these Terms of Use, please contact us:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <Mail className="h-6 w-6 text-blue-200 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">Email</span>
                                    <a href="mailto:info@himalayanama.com" className="font-bold text-white hover:underline text-base">
                                        info@himalayanama.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <MapPin className="h-6 w-6 text-blue-200 shrink-0" />
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">Location</span>
                                    <span className="font-bold text-white text-base">Street No. 16, Lakeside, Pokhara, Nepal</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>
            </section>

            <Footer />
        </div>
    )
}
