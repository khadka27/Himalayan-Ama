"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"
import { ShieldCheck, Lock, Database, Eye, Cookie, UserCheck, ExternalLink, RefreshCw, Mail, Phone, MapPin, CheckCircle2 } from "lucide-react"

export default function PoliciesPageClient() {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <Hero
                badge="Privacy & Security"
                title="Privacy Policy"
                description="Himalayan Aama respects your privacy and is committed to protecting your personal information."
                image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop"
            />

            {/* H1 Main Header Section */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                        Protecting Your <span className="text-blue-600">Personal Information</span>
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium text-left pt-4">
                        Himalayan Aama respects your privacy and is committed to protecting the personal information you share with us while using our website or booking our self-catering 1BHK apartment in Lakeside, Pokhara. This Privacy Policy explains how we collect, use, and safeguard your information.
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl space-y-16">

                    {/* Information We Collect */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Database className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Information We Collect</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            When you visit our website or make a booking, we may collect the following information:
                        </p>
                        <ul className="space-y-4 text-base text-gray-700 font-medium">
                            <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-gray-900">Personal Information:</strong> Name, email address, phone number, billing address, and payment details.
                                </div>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-gray-900">Booking Information:</strong> Dates of stay, number of guests, and special requests.
                                </div>
                            </li>
                            <li className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="text-gray-900">Website Usage Data:</strong> IP address, browser type, pages visited, and interaction with our website.
                                </div>
                            </li>
                        </ul>
                        <p className="text-gray-600 text-base leading-relaxed font-medium pt-2">
                            We collect this information to provide a seamless experience when booking your private apartment in Pokhara and to improve our services.
                        </p>
                    </Card>

                    {/* How We Use Your Information */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Eye className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How We Use Your Information</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            We use the information collected to:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Process bookings and confirm your stay at our apartment near Phewa Lake",
                                "Communicate with guests regarding reservations, inquiries, and special offers",
                                "Improve our website, services, and guest experience",
                                "Ensure the security and safety of guests during their stay"
                            ].map((text, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                                    <span className="text-base text-gray-800 font-bold leading-snug">{text}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Sharing Your Information */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Lock className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Sharing Your Information</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. Your data may be shared only with trusted service providers for:
                        </p>
                        <ul className="space-y-3 text-base text-gray-700 font-medium">
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                <span>Payment processing</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                <span>Email communication for booking confirmations</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                <span>Website analytics and performance improvements</span>
                            </li>
                        </ul>
                    </Card>

                    {/* Cookies & Data Security Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Cookie className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cookies and Tracking Technologies</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Our website may use cookies to enhance user experience, track visitor behavior, and improve functionality. You can choose to disable cookies in your browser settings, but some features of our website may not function properly without them.
                            </p>
                        </Card>

                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Data Security</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Himalayan Aama uses industry-standard security measures to protect your personal information. We take reasonable steps to prevent unauthorized access, disclosure, or misuse of your data.
                            </p>
                        </Card>
                    </div>

                    {/* Your Rights */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Your Rights</h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed">
                            You have the right to:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Access the personal information we hold about you",
                                "Request corrections to any inaccurate information",
                                "Request deletion of your data, subject to legal obligations",
                                "Opt-out of marketing communications"
                            ].map((right, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                                    <span className="text-base text-gray-800 font-bold">{right}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-gray-600 text-base font-medium pt-2">
                            To exercise these rights, please contact us at{" "}
                            <a href="mailto:info@himalayanAama.com" className="text-blue-600 font-bold underline">
                                info@himalayanAama.com
                            </a>.
                        </p>
                    </Card>

                    {/* External Links & Policy Changes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <ExternalLink className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">External Links</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external websites. We encourage you to read their privacy policies before providing any personal information.
                            </p>
                        </Card>

                        <Card className="p-8 md:p-10 rounded-[32px] bg-white border border-gray-100 shadow-xl space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <RefreshCw className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Changes to This Privacy Policy</h2>
                            <p className="text-gray-600 leading-relaxed font-medium text-base">
                                Himalayan Aama may update this Privacy Policy periodically. Any changes will be posted on this page with the revised effective date. We encourage you to review this policy regularly to stay informed.
                            </p>
                        </Card>
                    </div>

                    {/* Contact Us (H2) */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl space-y-8">
                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Contact Us</h2>
                            <p className="text-blue-100 text-lg font-medium">
                                If you have questions or concerns about this Privacy Policy or the handling of your personal information, please contact us:
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
                                By using our website or booking our BBQ-friendly self-catering apartment in Lakeside, Pokhara, you agree to the terms of this Privacy Policy.
                            </p>
                        </div>
                    </Card>

                </div>
            </section>

            <Footer />
        </div>
    )
}
