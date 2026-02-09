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
import { MapPin, Phone, Mail, Loader2, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/services/axios-instance";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import Hero from "@/components/hero";
import { sendInquiryNotification } from "@/services/whatsapp.service";

interface Service {
  id: string;
  title: string;
  description: string;
  session_time: string | null;
  capacity: number | string;
  class_schedule: string[] | string;
  price: string;
  image: string;
  image_urls?: string[];
  level: string;
  yoga_type?: string;
  benefits: string[];
  slug?: string;
  currency?: string;
  instructor_name?: string;
}

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
  const [services, setServices] = useState<Service[]>([]);

  // Fetch services for the dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/api/services");
        if (data.status) {
          setServices(data.data);
        } else {
          toast.error("Failed to fetch services");
        }
      } catch (err) {
        const error = err as Error;
        toast.error(error.message || "Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare payload - only include service_id if it's not "general"
      const payload: any = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      if (formData.phone) {
        payload.phone = formData.phone;
      }

      if (formData.service !== "general") {
        payload.service_id = formData.service;
      }

      const { data } = await axiosInstance.post("/api/inquiries", payload);

      if (data.status) {
        toast.success(data.message || "Message sent successfully!");

        // WhatsApp Notification to Admin
        try {
          await sendInquiryNotification(payload);
        } catch (waError) {
          console.error("WhatsApp inquiry notification error (non-blocking):", waError);
        }

        // Reset form
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
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <Hero title="Contact Us" description="Have a question? Need more info? Reach out to us and we'll respond as soon as possible." image="/banner/contact.png" />

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Info & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-3xl font-bold">Get In Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#627A64]">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Visit Us</p>
                      <p className="text-sm text-muted-foreground">Pokhara, Nepal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#627A64]">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Call Us</p>
                      <p className="text-sm text-muted-foreground">
                        +977-9816685279 | +977-9816685280
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#627A64]">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Email Us</p>
                      <p className="text-sm text-muted-foreground">
                        himalayanyogini@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="h-80 overflow-hidden rounded-lg bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3528.9912998607406!2d83.9405475!3d28.229792699999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399594e2748b168d%3A0x22c73dc654548de9!2sHimalayan%20Yogini!5e1!3m2!1sen!2snp!4v1769412618677!5m2!1sen!2snp"
                  width="600"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                  title="Yoga Studio Location"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Send Us a Message</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+977-9816685279"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="inquiry-service"
                  className="text-sm font-medium"
                >
                  Service Inquiry
                </label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select
                    value={formData.service}
                    onValueChange={(value) =>
                      setFormData({ ...formData, service: value })
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="inquiry-service" className="text-foreground w-full">
                      <SelectValue placeholder="Which service are you interested in?" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell us more about what you need..."
                  rows={6}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <Button
                className="w-full bg-[#627A64] hover:bg-[#4A5D4C]"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                Fields marked with <span className="text-red-500">*</span> are
                required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-[#faf8f3] to-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our studio, classes, and philosophy.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            <FAQItem
              question="Do I need prior yoga experience to join classes at Yogini?"
              answer="No. Yogini welcomes beginners as well as experienced practitioners. Our yoga instructors adapt each class to meet students where they are, ensuring a safe and supportive yoga experience for all levels."
            />
            <FAQItem
              question="What style of yoga is taught at Yogini?"
              answer="Yogini teaches traditional and spiritual yoga rooted in Himalayan philosophy. Our approach integrates asana, pranayama, meditation, and classical teachings such as the Yoga Sutras, karma yoga, bhakti yoga, raja yoga, and kriya yoga."
            />
            <FAQItem
              question="Are your instructors certified and experienced?"
              answer="Yes. All classes at Yogini are guided by certified yoga instructors with dedicated training and practical experience. Our yoga teachers and yoga masters teach with authenticity, discipline, and respect for traditional yoga practices."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-medium text-gray-800 text-lg">{question}</span>
        <div
          className={`shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#627A64] text-white" : "bg-gray-100 text-gray-500"
            }`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-transparent">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
