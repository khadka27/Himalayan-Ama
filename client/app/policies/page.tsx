"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import Hero from "@/components/hero"

export default function PoliciesPage() {
    return (
        <div className="min-h-screen">
            <Header />

            <Hero
                title="Booking & Policies"
                description="Important information regarding your booking, cancellations, and payments."
                image="/banner/about.png"
            />

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Booking & Cancellation Policy</h2>
                                <div className="prose text-muted-foreground">
                                    <p className="mb-4">
                                        We strive to make our courses and retreats accessible. Please read the following policies carefully before booking.
                                        (Effective as of January 2025)
                                    </p>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Cancellation</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>
                                            <strong>No cancellations</strong> are accepted less than <strong>30 days</strong> before the course start date.
                                        </li>
                                        <li>
                                            If a cancellation occurs less than 30 days prior, credit may be offered for the same course up to 1 year from the original start date (subject to availability).
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">Payment & Deposits</h2>
                                <div className="prose text-muted-foreground">
                                    <p className="mb-4">
                                        To secure your spot, a non-refundable deposit is required at the time of booking.
                                    </p>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Deposit Amounts</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>
                                            <strong>Teacher Trainings (200hr / 300hr):</strong> 25% non-refundable deposit.
                                        </li>
                                        <li>
                                            <strong>Retreats & Short Courses:</strong> 50% non-refundable deposit.
                                        </li>
                                    </ul>

                                    <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Discounts</h3>
                                    <p>
                                        Receive a <strong>5% discount</strong> if you pay the full amount at least 30 days before the course start date.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <Card className="p-8 bg-gray-50 border-none">
                                <h3 className="text-xl font-bold mb-4">Capacity Limits</h3>
                                <p className="text-muted-foreground mb-4">
                                    To ensure personalized attention and high-quality instruction, we strictly limit our class sizes.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium">Teacher Trainings</span>
                                        <span className="text-[#627A64] font-bold">Max 5-6 Students</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium">Drop-ins / Short Courses</span>
                                        <span className="text-[#627A64] font-bold">Max 10 Students</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="font-medium">Wellness Therapies</span>
                                        <span className="text-[#627A64] font-bold">1-2 Persons</span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-8 bg-[#627A64] text-white">
                                <h3 className="text-xl font-bold mb-4">Need Assistance?</h3>
                                <p className="mb-6 opacity-90">
                                    If you have any questions regarding our policies or need help with a booking, please contact our team.
                                </p>
                                <ul className="space-y-2 opacity-90">
                                    <li>Email: himalayanyogini@gmail.com</li>
                                    <li>Phone: +977-9816685279</li>
                                    <li>Phone: +977-9816685280</li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
