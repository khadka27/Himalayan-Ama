"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Loader2, Send, Sparkles, CheckCircle2, CalendarCheck, HelpCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import axiosInstance from "@/services/axios-instance";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Hero from "@/components/hero";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { flats, isLoadingFlats } = useApp();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || undefined,
        flat: formData.service === "general" ? "General Inquiry" : `Apartment Inquiry: ${formData.service}`,
      };

      const { data } = await axiosInstance.post("/api/v1/inquiry", payload);

      if (data.status || data.success) {
        toast.success(data.message || "Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "general",
          message: "",
        });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyContactPoints = [
    "Direct communication ensures the best rates and availability",
    "Get information about short-term and long-term apartment stays in Pokhara",
    "Learn about nearby attractions, Phewa Lake activities, and Lakeside Pokhara experiences",
    "Personalized assistance for couples, families, or solo travelers",
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <Hero
        badge="Get in Touch"
        title="Contact Himalayan Aama"
        description="We are always happy to hear from you. Get in touch for inquiries, bookings, or local Pokhara guidance."
        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Main Intro (H1) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            We&apos;d Love to <span className="text-blue-600">Hear From You</span>
          </h2>
          <p className="text-xl text-gray-600 font-medium leading-relaxed max-w-4xl mx-auto">
            We are always happy to hear from you. Whether you are planning a short vacation, a long stay, or want more information about our self-catering 1BHK apartment in Lakeside, Pokhara, our team is here to assist you.
          </p>
        </div>
      </section>

      {/* How to Reach Us (H2) & Booking Inquiries (H2) */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Reach Us Card */}
            <Card className="p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] bg-white shadow-xl border-none space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Contact Details</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">How to Reach Us</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Address</span>
                    <p className="text-base sm:text-lg font-bold text-gray-900">Street No. 16, Lakeside, Pokhara, Nepal</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone</span>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      <a href="tel:+9779816685279" className="hover:text-blue-600 transition-colors">
                        +977 9816685279
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</span>
                    <p className="text-base sm:text-lg font-bold text-gray-900 break-all sm:break-normal">
                      <a href="mailto:info@himalayanAama.com" className="hover:text-blue-600 transition-colors">
                        info@himalayanAama.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium pt-2 border-t border-slate-100">
                Himalayan Aama is conveniently located near Phewa Lake, making it easy to reach from anywhere in Pokhara. Whether you are a local guest or an international traveler, finding us is simple.
              </p>
            </Card>

            {/* Booking Inquiries Card */}
            <Card className="p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl border-none space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-white/10 text-white flex items-center justify-center backdrop-blur-md">
                  <CalendarCheck className="h-7 w-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Booking Inquiries</h2>
                <p className="text-base sm:text-lg text-blue-50 leading-relaxed font-medium">
                  To reserve your private apartment in Pokhara or check availability, simply send us an email or call. We respond promptly to all booking requests.
                </p>
                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-medium">
                  Guests can also use our online booking form below to confirm their stay at our BBQ-friendly self-catering apartment in Lakeside Pokhara.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <a
                  href="https://wa.me/9779816685279"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full h-14 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:bg-blue-50 transition-all text-base"
                >
                  <Phone className="h-5 w-5" />
                  Quick WhatsApp Inquiry
                </a>
              </div>
            </Card>
          </div>

          {/* Interactive Map */}
          <div className="h-[300px] sm:h-[420px] w-full rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d878.8156819840887!2d83.9399961!3d28.2297043!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595c96a3e7797%3A0xf5808af50c886ae1!2sHimalayan%20Aama%20Apartment!5e1!3m2!1sen!2snp!4v1770621608284!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
              title="Himalayan Aama Apartment Location"
            />
          </div>
        </div>
      </section>

      {/* Send Us a Message (H2) & Form */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <Card className="p-6 sm:p-10 md:p-14 rounded-[24px] sm:rounded-[40px] shadow-2xl border border-gray-100 bg-white space-y-8 sm:space-y-10">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                Online Form
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Send Us a Message</h2>
              <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
                Have a question about your stay, our apartment, or facilities? Fill out the contact form below and we will get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Full Name"
                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-base"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-base"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number (Optional)</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977-9800000000"
                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Interested In</Label>
                  {isLoadingFlats ? (
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  ) : (
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium text-base">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="general" className="rounded-xl py-3 font-medium">General Inquiry</SelectItem>
                        {flats.map((flat) => (
                          <SelectItem key={flat._id} value={flat.flatName} className="rounded-xl py-3 font-medium">
                            {flat.flatName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your travel dates, questions, or requirements..."
                  className="min-h-[160px] rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium p-6 text-base"
                  required
                />
              </div>

              <Button
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all text-lg group"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Contact Himalayan Aama (H2) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-5xl space-y-16">
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Why Reach Out</span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Why Contact Himalayan Aama</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyContactPoints.map((point, idx) => (
              <Card key={idx} className="p-8 rounded-[30px] border border-gray-100 shadow-md bg-white hover:shadow-xl transition-all flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-lg font-bold text-gray-800 leading-snug">{point}</p>
              </Card>
            ))}
          </div>

          <div className="bg-blue-600 text-white rounded-[32px] p-8 md:p-12 shadow-2xl text-center space-y-4 max-w-4xl mx-auto">
            <p className="text-xl font-medium leading-relaxed">
              At Himalayan Aama, we are committed to making your stay in Lakeside, Pokhara peaceful, memorable, and truly homelike. Contact us today and start planning your perfect self-catering stay near Phewa Lake.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block font-semibold ${className}`}>{children}</label>;
}
