"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Heart, Shield, CheckCircle2, MapPin, Utensils, Flame, Compass, CalendarCheck, Home, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Hero from "@/components/hero"
import { useApp } from "@/context/AppContext"

export default function AboutPageClient() {
  const { hosts, isLoadingHosts } = useApp()
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000"

  const features = [
    "Prime location in Lakeside, Pokhara",
    "Fully furnished 1BHK apartment for a private stay",
    "Self-catering kitchen with essential utensils",
    "BBQ-friendly open compound for outdoor relaxation",
    "Peaceful and private environment near Phewa Lake",
    "Ideal for couples, small families, and long-term stays",
  ]

  const commitments = [
    {
      title: "Cleanliness & Hygiene",
      desc: "Maintaining high standards of cleanliness and hygiene for every stay.",
      icon: Shield,
    },
    {
      title: "Transparent Booking",
      desc: "Providing clear and transparent booking communication with no hidden fees.",
      icon: Award,
    },
    {
      title: "Peaceful Environment",
      desc: "Ensuring a quiet, safe, and restful sanctuary for all our guests.",
      icon: Heart,
    },
    {
      title: "Authentic Hospitality",
      desc: "Offering a genuine Nepali hospitality experience where you feel like family.",
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Hero
        badge="Welcome to Pokhara"
        title="About Himalayan Aama"
        description="Your Home Away from Home in Lakeside Pokhara"
        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Main Intro & Welcome (H1 Context) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="space-y-8 text-center">
            <div className="space-y-6 text-xl text-gray-600 leading-relaxed font-medium text-left max-w-4xl mx-auto pt-4">
              <p>
                Welcome to <strong>Himalayan Aama</strong>, a peaceful self-catering 1BHK apartment in Lakeside, Pokhara, created for travelers who prefer comfort, privacy, and a home-like stay instead of a traditional hotel experience.
              </p>
              <p>
                Located just a short walk from the beautiful Phewa Lake, Himalayan Aama offers a private apartment where guests can relax, cook their own meals, enjoy BBQ time in the open compound, and explore Pokhara at their own pace. Whether you are a couple, a small family, a digital nomad, or a traveler seeking a quiet and comfortable stay, our apartment is designed to make you feel like home.
              </p>
              <p>
                Unlike hotels, Himalayan Aama gives you the freedom of a fully furnished 1BHK vacation rental in Lakeside Pokhara, with a kitchen, utensils, fridge, cozy living space, bedroom, bathroom, and an outdoor BBQ-friendly area. Everything you need for a convenient self-cooking stay in Pokhara is provided.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story (H2) */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
              ESTABLISHED 2020
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Our Story</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Discover the story and thoughtful vision behind Himalayan Ama, a welcoming self-catering stay in Lakeside, Pokhara.
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 max-w-6xl mx-auto">
            <div className="relative h-[500px] overflow-hidden rounded-[40px] shadow-2xl border-8 border-white group">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                alt="Himalayan Aama Living Space"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">ESTABLISHED 2020</span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  A Home-Like Stay in Lakeside Pokhara
                </h3>
              </div>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  Himalayan Aama was established in 2020 with a simple vision: to offer travelers a peaceful, private, and self-catering stay in Lakeside, Pokhara.
                </p>
                <p>
                  The idea came from travelers wanting more freedom than a traditional hotel room, with space to relax, prepare their own meals, and experience Pokhara at their own pace.
                </p>
                <p>
                  The name <strong>Aama</strong> represents warmth, care, and hospitality, values deeply rooted in Nepali culture. Our goal is to make every guest feel welcomed, comfortable, and at home during their stay.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Warm Hospitality</h4>
                    <p className="text-sm text-gray-500 font-medium">Thoughtful support inspired by Nepali culture.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Home className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">Private & Flexible Stay</h4>
                    <p className="text-sm text-gray-500 font-medium">A comfortable 1BHK space to cook, relax, and enjoy Pokhara your way.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Himalayan Aama Special (H2) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
              Key Highlights
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              What Makes Himalayan Aama Special
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 rounded-2xl border border-gray-100 shadow-sm bg-slate-50/70 hover:bg-white hover:shadow-md transition-all flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-gray-800 leading-snug">{feature}</span>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-[32px] p-8 md:p-12 shadow-2xl space-y-6 text-lg leading-relaxed font-medium">
            <p>
              Our apartment is designed to give you the perfect balance of comfort, privacy, and freedom. Enjoy a comfortable bedroom, relaxing living area, functional kitchen, and clean bathroom, giving you everything needed for a short getaway or extended stay. Guests can bring groceries, cook their favorite meals, and truly experience the freedom of a self-catering stay in Pokhara.
            </p>
            <p className="text-blue-50 italic">
              &quot;From the apartment, you can enjoy serene views of Phewa Lake and Lakeside streets, making your stay even more memorable. This is not a hotel room—it’s your own private apartment in Pokhara where you can relax, cook, and live like a local.&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Our Commitment (H2) */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-16 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Our Standards</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Our Commitment</h2>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
              We continuously work to improve our services based on guest feedback and evolving travel needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {commitments.map((item, idx) => (
              <Card key={idx} className="p-8 rounded-[30px] border border-gray-100 shadow-md bg-white hover:shadow-xl transition-all space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Lakeside Like a Local (H2) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 inline-block">
                Authentic Lifestyle
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Experience Lakeside Like a Local
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Staying at Himalayan Aama allows you to enjoy Pokhara beyond tourism. Buy fresh groceries from local markets, cook your favorite meals, enjoy evenings with BBQ in our open compound, take a leisurely stroll to Phewa Lake, and live comfortably in your own private space.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-slate-100 px-4 py-2.5 rounded-xl">
                  <Utensils className="h-4 w-4 text-blue-600" />
                  Self-Cooking Kitchen
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-slate-100 px-4 py-2.5 rounded-xl">
                  <Flame className="h-4 w-4 text-blue-600" />
                  Outdoor BBQ Area
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-slate-100 px-4 py-2.5 rounded-xl">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Walk to Phewa Lake
                </div>
              </div>
            </div>

            <div className="md:col-span-5 relative h-80 rounded-[32px] overflow-hidden shadow-xl border-4 border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop"
                alt="Phewa Lake Pokhara"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Book Your Stay (H2) */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-8 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md inline-block">
            Reserve Your Haven
          </span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Book Your Stay
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
            We welcome both domestic and international guests to Himalayan Aama, a peaceful self-catering 1BHK apartment in Lakeside, Pokhara. Simply check availability on our website and send us a booking request. We will respond promptly to confirm your stay.
          </p>
          <p className="text-sm md:text-base text-gray-400 italic">
            Himalayan Aama is more than just an apartment. It is your private apartment near Phewa Lake, offering a BBQ-friendly self-catering stay in Pokhara with a fully equipped kitchen, cozy living space, and all the comforts of home.
          </p>

          <div className="pt-4">
            <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg h-16 px-10 rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105">
              <Link href="/apartments" className="flex items-center gap-3">
                <CalendarCheck className="h-6 w-6" />
                Check Availability & Book
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Meet Our Hosts */}
      <section className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-blue-100 text-blue-600 text-sm font-bold">
              <Users className="h-4 w-4" />
              <span>Our Dedicated Team</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Meet Your Dedicated Hosts</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500 font-medium">
              We are a group of locals passionate about sharing the beauty of Pokhara through exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
            {isLoadingHosts ? (
              <Card className="overflow-hidden animate-pulse rounded-[40px] border-none shadow-xl bg-white h-full col-span-full max-w-xl mx-auto w-full">
                <div className="bg-gray-200 h-[420px] w-full" />
                <div className="p-10 space-y-4">
                  <div className="h-8 bg-gray-200 rounded-xl w-1/2" />
                  <div className="h-4 bg-gray-200 rounded-xl w-1/4" />
                  <div className="h-24 bg-gray-200 rounded-xl" />
                </div>
              </Card>
            ) : hosts && hosts.length > 0 ? (
              hosts.map((host: any) => {
                const imageSrc = host.imageUri
                  ? (host.imageUri.startsWith("http") ? host.imageUri : `${BACKEND}/images/${host.imageUri}`)
                  : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"

                const langText = host.languages
                  ? (Array.isArray(host.languages) ? host.languages.join(", ") : host.languages)
                  : ""

                const paragraphs = Array.isArray(host.bioParagraphs) && host.bioParagraphs.length > 0
                  ? host.bioParagraphs
                  : (host.bio ? [host.bio] : [])

                return (
                  <Card key={host._id || host.hostName} className="overflow-hidden hover:shadow-2xl transition-all duration-500 rounded-[40px] border-none shadow-xl bg-white group flex flex-col justify-between">
                    <div className="relative h-[420px] overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={host.hostName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                        {host.profession && (
                          <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-1 shadow-md">
                            {host.profession}
                          </span>
                        )}
                        <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">{host.hostName}</h3>
                      </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-6">
                      {host.quote && (
                        <p className="text-lg leading-relaxed text-gray-700 font-semibold italic border-l-4 border-blue-600 pl-4">
                          &quot;{host.quote}&quot;
                        </p>
                      )}

                      {paragraphs.length > 0 && (
                        <div className="space-y-4 text-base text-gray-600 font-medium leading-relaxed">
                          {paragraphs.map((pText: string, pIdx: number) => (
                            <p key={pIdx}>{pText}</p>
                          ))}
                        </div>
                      )}

                      {(langText || host.hospitalityBadge) && (
                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-sm font-bold text-gray-500">
                          {langText ? (
                            <span>Languages spoken: <strong className="text-gray-900">{langText}</strong></span>
                          ) : <span />}
                          {host.hospitalityBadge && (
                            <span className="text-blue-600">{host.hospitalityBadge}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-200">
                <Users className="mx-auto h-12 w-12 mb-4 text-gray-300" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No host profiles available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
