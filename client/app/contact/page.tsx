"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Loader2, Plus, Minus, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [flats, setFlats] = useState<any[]>([]);

  // Fetch flats for the dropdown
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/api/v1/flats");
        if (data.success) {
          setFlats(data.flats);
        } else {
          toast.error("Failed to fetch apartments");
        }
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to load apartments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlats();
  }, []);

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
      const payload: any = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || undefined,
        service: formData.service === "general" ? "General Inquiry" : `Apartment Inquiry: ${formData.service}`,
      };

      const { data } = await axiosInstance.post("/api/inquiries", payload);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <Hero
        title="Get In Touch"
        description="Our team is ready to help you find your sanctuary in the heart of Nepal."
        image="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="h-4 w-4" />
                  <span>Always Available</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">We're here to help <br /><span className="text-blue-500">whenever you need.</span></h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-md">Whether you have questions about amenities, availability, or local tips for Pokhara, we're just a message away.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: MapPin, title: "Location", val: "Lakeside, Pokhara", color: "bg-blue-50 text-blue-500" },
                  { icon: Phone, title: "Phone", val: "+977 9816685279", color: "bg-blue-50 text-blue-500" },
                  { icon: Mail, title: "Email", val: "info@himalayanama.com", color: "bg-blue-50 text-blue-500" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center shadow-lg shadow-blue-50`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 uppercase tracking-widest text-[10px] opacity-40 mb-1">{item.title}</p>
                      <p className="font-bold text-gray-900">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-96 w-full rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d878.8156819840887!2d83.9399961!3d28.2297043!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595c96a3e7797%3A0xf5808af50c886ae1!2sHimalayan%20Aama%20Apartment!5e0!3m2!1sen!2snp!4v1770621608284!5m2!1sen!2snp" width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale contrast-125"
                  title="Apartment Location"
                />
              </div>
            </div>

            <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send a Message</h2>
                <p className="text-gray-500 font-medium">We'll get back to you within 24 hours.</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Full Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number (Optional)</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+977-9800000000"
                    className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Interested In</Label>
                  {isLoading ? (
                    <Skeleton className="h-14 w-full rounded-2xl" />
                  ) : (
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium">
                        <SelectValue placeholder="Which apartment are you interested in?" />
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

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Message</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're looking for..."
                    className="min-h-[150px] rounded-2xl bg-gray-50 border-none focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-medium p-6"
                  />
                </div>

                <Button
                  className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg group"
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
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24 mb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
            <div className="h-1.5 w-20 bg-blue-500 rounded-full mx-auto" />
            <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
              Find quick answers to common questions about life at Himalayan Ama.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {[
              { q: "What is the rental process?", a: "Find an apartment you like, send an inquiry, and our concierge will schedule a private viewing. If you love it, we'll walk you through the simple digital check-in." },
              { q: "Are the residences furnished?", a: "Yes, our properties are curated with premium furnishings that blend Nepalese craftsmanship with modern comfort." },
              { q: "What's included in my stay?", a: "High-speed Wi-Fi, premium maintenance, and access to our local recommendations engine are standard across all residences." }
            ].map((item, i) => (
              <FAQItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block font-semibold ${className}`}>{children}</label>
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`rounded-3xl border transition-all duration-500 ${isOpen ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-gray-100 hover:border-blue-100'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 text-left focus:outline-none group"
      >
        <span className="font-bold text-gray-900 text-xl tracking-tight leading-tight">{question}</span>
        <div
          className={`shrink-0 ml-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isOpen ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "bg-gray-50 text-gray-400"
            }`}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 text-gray-600 text-lg font-medium leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
