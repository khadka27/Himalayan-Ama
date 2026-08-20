"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"
import { PenTool, CheckCircle2, Send, Compass, Utensils, Flame, Globe, Mail, Home } from "lucide-react"

export default function WriteForUsClient() {
    const topics = [
        {
            title: "Traveling in Pokhara",
            desc: "Sightseeing, trekking, paragliding, and lakeside experiences.",
            icon: Compass,
        },
        {
            title: "Self-Catering & Apartment Stays",
            desc: "Tips for making the most of a 1BHK apartment stay in Lakeside Pokhara.",
            icon: Home,
        },
        {
            title: "Local Culture & Food",
            desc: "Discover Nepali traditions, local markets, and authentic recipes.",
            icon: Utensils,
        },
        {
            title: "Nomad & Family Travel Tips",
            desc: "Insights on staying comfortably in Pokhara for couples, families, and digital nomads.",
            icon: Globe,
        },
        {
            title: "BBQ & Outdoor Living",
            desc: "BBQ-friendly outdoor activities and compound relaxation in self-catering accommodations.",
            icon: Flame,
        },
    ]

    const guidelines = [
        "Original content only. No plagiarism.",
        "Minimum 500 words per article.",
        "Use SEO-friendly language when possible (e.g., self-catering apartment Pokhara, 1BHK apartment in Lakeside Pokhara, vacation rental Pokhara, apartment stay in Pokhara).",
        "Include high-quality images where applicable, with proper captions and alt text.",
        "Provide your name, bio, and social media links for credit.",
    ]

    const whyWritePoints = [
        "Share your expertise with travelers looking for the best self-catering and apartment stays in Lakeside Pokhara.",
        "Get your content featured on a website with SEO visibility targeting Pokhara tourism and accommodations.",
        "Connect with a growing audience of travelers, digital nomads, and adventure seekers.",
    ]

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero */}
            <Hero
                title="Write for Us"
                description="Share your travel stories, Pokhara tips, and self-catering guides with our growing Himalayan Aama community."
                image="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
            />

            {/* H1 Main Title & Welcome */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl text-center space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                        Guest Contributions
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                        Write for Us – <span className="text-blue-600">Himalayan Aama</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium text-left pt-4">
                        Are you passionate about travel, tourism, or the beauty of Pokhara and Lakeside? Do you love sharing tips on self-catering stays, local attractions, or adventure activities? Himalayan Aama welcomes you to contribute!
                    </p>
                </div>
            </section>

            {/* Topics Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 max-w-5xl space-y-16">

                    {/* What We Accept */}
                    <div className="space-y-8">
                        <div className="text-center space-y-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Categories</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Topics We Accept</h2>
                            <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
                                We accept guest articles, travel guides, reviews, and stories related to the following themes:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((topic, idx) => (
                                <Card key={idx} className="p-8 rounded-[30px] bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all space-y-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <topic.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{topic.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Submission Guidelines (H2) */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <PenTool className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Submission Guidelines</h2>
                        </div>
                        <ul className="space-y-4 text-base text-gray-700 font-medium">
                            {guidelines.map((guide, idx) => (
                                <li key={idx} className="flex items-start gap-3 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                                    <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                    <span className="text-base text-gray-800 font-medium leading-snug">{guide}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* How to Submit (H2) */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Send className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">How to Submit</h2>
                        </div>
                        <div className="space-y-4 text-lg text-gray-600 font-medium leading-relaxed">
                            <p>
                                Send your article in Word or Google Docs format to{" "}
                                <a href="mailto:info@himalayanAama.com" className="text-blue-600 font-bold underline">
                                    info@himalayanAama.com
                                </a>. Include any images in JPEG/PNG format and ensure you have permission to use them.
                            </p>
                            <p>
                                Our team will review submissions and may edit for clarity, style, and SEO optimization. Once approved, your article will be published on the Himalayan Aama blog with proper credit to you.
                            </p>
                        </div>
                    </Card>

                    {/* Why Write for Himalayan Aama (H2) */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-white border border-gray-100 shadow-xl space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <PenTool className="h-6 w-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Why Write for Himalayan Aama</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {whyWritePoints.map((point, idx) => (
                                <div key={idx} className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm text-gray-800 font-bold leading-relaxed">{point}</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Call to Action Card */}
                    <Card className="p-10 md:p-12 rounded-[36px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to Submit Your Article?</h2>
                        <p className="text-lg text-blue-100 leading-relaxed font-medium max-w-3xl mx-auto">
                            We look forward to your contributions and helping travelers discover the beauty and comfort of Himalayan Aama and Pokhara!
                        </p>
                        <div className="pt-2">
                            <a
                                href="mailto:info@himalayanAama.com?subject=Guest%20Article%20Submission%20-%20Himalayan%20Aama"
                                className="inline-flex items-center justify-center gap-3 h-16 px-10 rounded-2xl bg-white text-blue-600 font-bold text-lg shadow-xl hover:bg-blue-50 transition-all hover:scale-105"
                            >
                                <Mail className="h-6 w-6" />
                                Submit Article via Email
                            </a>
                        </div>
                    </Card>

                </div>
            </section>

            <Footer />
        </div>
    )
}
