"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { motion } from "framer-motion"

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Disclaimer</h1>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8 text-slate-600 leading-relaxed text-lg">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">General Information</h2>
                            <p>
                                The information provided by Himalayan Ama ("we," "us," or "our") on our website is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">External Links Disclaimer</h2>
                            <p>
                                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Professional Disclaimer</h2>
                            <p>
                                The Site cannot and does not contain legal or real estate advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Errors and Omissions</h2>
                            <p>
                                While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Fair Use Disclaimer</h2>
                            <p>
                                The Company may use copyrighted material which has not always been specifically authorized by the copyright owner. The Company is making such material available for criticism, comment, news reporting, teaching, scholarship, or research.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Us</h2>
                            <p>
                                If you have any questions about this Disclaimer, You can contact Us:
                            </p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>By email: info@himalayanama.com</li>
                                <li>By phone: +977-9816685279</li>
                            </ul>
                        </section>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}
