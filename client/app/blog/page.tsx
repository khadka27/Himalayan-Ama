"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogGridSkeleton } from "@/components/skeletons/blog-card-skeleton";
import axiosInstance from "@/services/axios-instance";
import { toast } from "sonner";
import Hero from "@/components/hero";

interface Blog {
  image_url: any;
  id: number;
  title: string;
  subtitle: string;
  description: string;
  excerpt: string;
  author: string;
  content: Array<{
    heading: string;
    paragraph: string;
  }>;
  conclusion: string;
  is_active: boolean;
  slug: string;
  image?: string;
  category?: string;
  created_at?: string;
  read_time?: string;
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/api/blogs");
        // Filter only active blogs
        const activeBlogs =
          data.data?.filter((blog: Blog) => blog.is_active) || [];
        setBlogs(activeBlogs);
      } catch (error) {
        toast.info(`Error fetching blogs`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredPosts = blogs.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "all") return matchesSearch;
    return (
      matchesSearch &&
      post.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-6">
            <BlogGridSkeleton />
          </div>
        </section>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No blog posts found.
              </p>
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <p className="mb-8 text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {blogs.length} blog posts
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="relative h-48">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        post.image_url
                          ? post.image_url.startsWith("http")
                            ? post.image_url
                            : `/${post.image_url}`
                          : "/placeholder.svg"
                      }
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  {post.category && (
                    <div className="absolute left-4 top-4 rounded-full bg-[#627A64] px-3 py-1 text-xs text-white">
                      {post.category}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    {post.created_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(post.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="mb-3 text-xl font-semibold leading-tight">
                    {post.title}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {post.read_time || "5 min read"}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      className="bg-[#627A64] hover:bg-[#4A5D4C] text-white"
                    >
                      <Link href={`/blog/${post.slug}`}>View Blog</Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full hover:bg-[#627A64] hover:text-white bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                className="h-9 w-9 rounded-full bg-[#627A64] text-white hover:bg-[#4A5D4C]"
              >
                1
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full hover:bg-[#627A64] hover:text-white bg-transparent"
              >
                2
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full hover:bg-[#627A64] hover:text-white bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <Hero title="Yoga & Wellness Blog" description="Explore insights, tips, and inspiration for your yoga journey and holistic wellness lifestyle" image="/banner/blog.png" />

      <section className="border-b bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search blog posts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className={
                selectedCategory === "all"
                  ? "bg-[#627A64] hover:bg-[#4A5D4C]"
                  : ""
              }
              variant={selectedCategory === "all" ? "default" : "ghost"}
            >
              All
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedCategory("yoga tips")}
              variant={selectedCategory === "yoga tips" ? "default" : "ghost"}
              className={
                selectedCategory === "yoga tips"
                  ? "bg-[#627A64] hover:bg-[#4A5D4C]"
                  : ""
              }
            >
              Yoga Tips
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedCategory("wellness")}
              variant={selectedCategory === "wellness" ? "default" : "ghost"}
              className={
                selectedCategory === "wellness"
                  ? "bg-[#627A64] hover:bg-[#4A5D4C]"
                  : ""
              }
            >
              Wellness
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedCategory("mindfulness")}
              variant={selectedCategory === "mindfulness" ? "default" : "ghost"}
              className={
                selectedCategory === "mindfulness"
                  ? "bg-[#627A64] hover:bg-[#4A5D4C]"
                  : ""
              }
            >
              Mindfulness
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedCategory("nutrition")}
              variant={selectedCategory === "nutrition" ? "default" : "ghost"}
              className={
                selectedCategory === "nutrition"
                  ? "bg-[#627A64] hover:bg-[#4A5D4C]"
                  : ""
              }
            >
              Nutrition
            </Button>
            <Button
              size="sm"
              onClick={() => setSelectedCategory("lifestyle")}
              variant={selectedCategory === "lifestyle" ? "default" : "ghost"}
              className={
                selectedCategory === "lifestyle"
                  ? "bg-[#627A64] hover:bg-[#4A5D4C]"
                  : ""
              }
            >
              Lifestyle
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      {renderContent()}

      {/* Newsletter Section */}
      <section className="relative overflow-hidden py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=400&width=1920&query=yoga meditation peaceful)",
            filter: "brightness(0.7)",
          }}
        />

      </section>

      <Footer />
    </div>
  );
}
