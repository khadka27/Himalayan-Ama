"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Facebook, Twitter, LinkIcon, Check, Eye, MessageSquare, Share2, BookOpen } from "lucide-react"
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
        const { data } = await axiosInstance.get(`/api/blogs/${slug}`)
        if (data.data && data.data.is_active) {
          setBlog(data.data)
        } else {
          // router.push("/blog");
        }
      } catch (error) {
        console.error("Error fetching blog:", error)
        // router.push("/blog");
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
    return `${minutes} min read`
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Back Navigation */}
      <div className="border-b bg-white py-4">
        <div className="container mx-auto px-6">
          <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="relative h-[400px] overflow-hidden bg-gray-200">
        <Image
          src={
            blog.image_url
              ? blog.image_url.startsWith("http")
                ? blog.image_url
                : `/${blog.image_url}`
              : "/placeholder.svg"
          }
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {blog.category && (
                <div className="mb-6 inline-block rounded-full bg-[#627A64] px-3 py-1 text-xs text-white">
                  <span className="flex items-center gap-2">
                    {blog.category}
                    <span className="h-1 w-1 rounded-full bg-white" />
                    {calculateReadTime()}
                  </span>
                </div>
              )}

              <h1 className="mb-6 text-4xl font-bold leading-tight text-balance">{blog.title}</h1>

              {blog.subtitle && <p className="mb-8 text-lg text-muted-foreground">{blog.subtitle}</p>}

              {/* Author Info */}
              <div className="mb-8 flex items-center justify-between border-b pb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-[#627A64]/20">
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-[#627A64]">
                      {blog.author.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">Published by {blog.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {blog.created_at
                        ? new Date(blog.created_at).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {blog.description && (
                <Card className="mb-8 border-l-4 border-l-[#627A64] bg-[#627A64]/5 p-6">
                  <p className="italic text-muted-foreground">{blog.description}</p>
                </Card>
              )}

              <div className="space-y-8">
                {blog.content.map((section, index) => (
                  <div key={index}>
                    <h2 className="mb-4 text-2xl font-semibold">
                      {String(index + 1).padStart(2, "0")} {section.heading}
                    </h2>
                    <p className="mb-4 leading-relaxed text-muted-foreground whitespace-pre-line">
                      {section.paragraph}
                    </p>
                  </div>
                ))}

                {blog.conclusion && (
                  <div>
                    <h3 className="mb-4 text-xl font-semibold">Final Thoughts</h3>
                    <p className="mb-4 leading-relaxed text-muted-foreground whitespace-pre-line">{blog.conclusion}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Takeaways */}
              <Card className="bg-[#627A64] p-6 text-white">
                <div className="mb-4 flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  <h3 className="font-semibold">Key Takeaways</h3>
                </div>
                <ul className="space-y-3 text-sm">
                  {blog.content.slice(0, 4).map((section, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>{section.heading}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Article Engagement */}
              <Card className="p-6">
                <h3 className="mb-4 font-semibold">Article Engagement</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      <span>Views</span>
                    </div>
                    <span className="font-medium">247</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Comments</span>
                    </div>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Share2 className="h-4 w-4" />
                      <span>Shares</span>
                    </div>
                    <span className="font-medium">82</span>
                  </div>
                </div>
              </Card>

              {/* Join a Class CTA */}
              <Card className="bg-gray-50 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#627A64]">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Join a Class</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Experience these learnings in person! Join one of our expert-instructed classes.
                </p>
                <Button asChild className="w-full bg-[#627A64] hover:bg-[#4A5D4C] text-white">
                  <Link href="/services">Browse Classes</Link>
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
