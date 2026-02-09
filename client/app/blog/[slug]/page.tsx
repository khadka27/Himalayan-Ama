"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Facebook, Twitter, LinkIcon, Check, Share2, Home, Sparkles, Clock, Globe } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BlogDetailSkeleton } from "@/components/skeletons/blog-detail-skeleton"
import axiosInstance from "@/services/axios-instance"

interface BlogContent {
  heading: string
  paragraph: string
}

interface Blog {
  id: number
  title: string
  subtitle: string
  description: string
  excerpt: string
  author: string
  content: BlogContent[]
  conclusion: string
  is_active: boolean
  slug: string
  image_url?: string
  category?: string
  created_at?: string
  read_time?: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true)
        const { data } = await axiosInstance.get(`/api/v1/blog/getBlog?slug=${slug}`)
        if (data.success && data.blog) {
          const backendBlog = data.blog;
          let content = [];
          try {
            content = typeof backendBlog.content === 'string'
              ? JSON.parse(backendBlog.content)
              : backendBlog.content;
          } catch (e) {
            console.error("Failed to parse content", e);
            content = [];
          }

          const mappedBlog: Blog = {
            id: backendBlog._id,
            title: backendBlog.title,
            subtitle: backendBlog.subtitle || "",
            description: backendBlog.description || backendBlog.shortDescription || "",
            excerpt: backendBlog.shortDescription || backendBlog.excerpt || "",
            author: backendBlog.author?.authorName || "Guest",
            content: content,
            conclusion: backendBlog.conclusion || "",
            is_active: backendBlog.isActive,
            slug: backendBlog.slug,
            image_url: backendBlog.bannerImageURI,
            category: backendBlog.category,
            created_at: backendBlog.publishDate || backendBlog.createdAt,
            read_time: "5 Min Read" // Placeholder
          };
          setBlog(mappedBlog)
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchBlog()
    }
  }, [slug, router])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <BlogDetailSkeleton />
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return null
  }

  const calculateReadTime = () => {
    if (blog.read_time) return blog.read_time
    const totalWords = blog.content.reduce((acc, section) => {
      return acc + section.heading.split(" ").length + section.paragraph.split(" ").length
    }, 0)
    const minutes = Math.ceil(totalWords / 200)
    return `${minutes} Min Read`
  }

  const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";
  const blogImage = blog.image_url
    ? (blog.image_url.startsWith("http") ? blog.image_url : `${BACKEND}/images/${blog.image_url}`)
    : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Image Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={blogImage}
          alt={blog.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />

        <div className="absolute inset-0 flex items-end pb-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl space-y-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors group">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Journal</span>
              </Link>

              <div className="space-y-4">
                {blog.category && (
                  <span className="inline-block rounded-xl bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-2xl tracking-widest uppercase">
                    {blog.category}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">{blog.title}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-8 text-white/80 font-bold uppercase tracking-widest text-[10px]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Sparkles className="h-4 w-4 text-blue-300" />
                  </div>
                  <span>By {blog.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Clock className="h-4 w-4 text-blue-300" />
                  </div>
                  <span>{calculateReadTime()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Globe className="h-4 w-4 text-blue-300" />
                  </div>
                  <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : 'Latest'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">

            {/* Sidebar Left - Share */}
            <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
              <div className="flex flex-col gap-6 items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 vertical-text mb-4">Share</span>
                {[Facebook, Twitter, LinkIcon].map((Icon, i) => (
                  <button key={i} className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-11 xl:col-span-7">
              {blog.subtitle && (
                <div className="relative mb-16 p-10 bg-blue-50/50 rounded-[40px] border border-blue-50">
                  <Sparkles className="absolute -top-4 -left-4 h-12 w-12 text-blue-200 opacity-50" />
                  <p className="text-2xl font-bold text-blue-900 leading-relaxed italic tracking-tight">"{blog.subtitle}"</p>
                </div>
              )}

              {blog.description && (
                <div className="mb-16 text-xl text-gray-600 leading-relaxed font-medium">
                  <p>{blog.description}</p>
                </div>
              )}

              <div className="space-y-20">
                {blog.content.map((section, index) => (
                  <div key={index} className="space-y-8 group">
                    <div className="flex items-center gap-6">
                      <span className="text-4xl font-bold text-blue-100 font-serif leading-none transition-colors group-hover:text-blue-500">{String(index + 1).padStart(2, "0")}</span>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{section.heading}</h2>
                    </div>
                    <div className="h-1.5 w-12 bg-blue-500 rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />
                    <p className="text-xl text-gray-600 leading-loose font-medium whitespace-pre-line">
                      {section.paragraph}
                    </p>
                  </div>
                ))}

                {blog.conclusion && (
                  <div className="pt-20 border-t-2 border-dashed border-gray-100 mt-24">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500 text-white font-bold text-xs uppercase tracking-widest mb-8">
                      <Check className="h-4 w-4" />
                      <span>Closing Thoughts</span>
                    </div>
                    <p className="text-2xl italic font-bold text-blue-900/70 leading-relaxed whitespace-pre-line tracking-tight">"{blog.conclusion}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Right */}
            <div className="lg:col-span-11 xl:col-span-4 space-y-12">
              {/* Summary Card */}
              <Card className="bg-blue-600 p-10 text-white rounded-[40px] border-none shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all" />
                <h3 className="font-bold text-2xl mb-8 tracking-tight">Inside the Journal</h3>
                <ul className="space-y-6">
                  {blog.content.map((section, index) => (
                    <li key={index} className="flex items-start gap-4 group/item">
                      <span className="text-blue-200 font-bold font-mono text-sm mt-1">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-lg font-bold text-blue-50 tracking-tight group-hover/item:text-white transition-colors">{section.heading}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Book Now Card */}
              <Card className="p-12 text-center rounded-[40px] border-none shadow-2xl bg-white group overflow-hidden border border-gray-50">
                <div className="mb-8 relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-blue-50 rounded-[30px] group-hover:rotate-12 transition-transform duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                    <Home className="h-10 w-10" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Experience it Firsthand</h3>
                <p className="mb-10 text-gray-500 font-medium leading-relaxed">
                  Start your own journey at Himalayan Ama. View our curated residences in Pokhara.
                </p>
                <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-16 rounded-2xl shadow-xl shadow-blue-100 transition-all text-lg">
                  <Link href="/apartments">Explore Suites</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
