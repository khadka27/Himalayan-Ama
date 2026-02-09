"use client"

import { cn } from "@/lib/utils"
import { Marquee } from "@/components/home/marquee"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import axiosInstance from "@/services/axios-instance"
import Image from "next/image"

interface ApiReview {
  id: string
  name: string
  review: string
  rating: number
}

interface TransformedReview {
  img: string
  name: string
  username: string
  body: string
  id: string
  rating?: number
}

// Transform API data to match ReviewCard requirements
const transformReviews = (reviews: ApiReview[]): TransformedReview[] => {
  return reviews.map((review) => ({
    img: `https://avatar.vercel.sh/${review.name.toLowerCase().replace(/\s+/g, '')}`,
    name: review.name,
    username: `@${review.name.toLowerCase().replace(/\s+/g, '')}`,
    body: review.review,
    id: review.id,
    rating: review.rating
  }))
}

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <motion.figure
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-lg",
        "border-sage-200 bg-white hover:bg-sage-50/50",
        "dark:border-sage-800 dark:bg-sage-950/[.10] dark:hover:bg-sage-900/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Image
            className="rounded-full ring-2 ring-sage-300/50"
            width="40"
            height="40"
            alt={name}
            src={img || "/placeholder.svg"}
            loading="lazy"
          />
        </motion.div>
        <div className="flex flex-col">
          <motion.figcaption
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-semibold text-sage-900 dark:text-white"
          >
            {name}
          </motion.figcaption>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ delay: 0.35 }}
            className="text-xs font-medium text-sage-600 dark:text-sage-400"
          >
            {username}
          </motion.p>
        </div>
      </div>
      <motion.blockquote
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 text-sm leading-relaxed text-sage-700 dark:text-sage-300"
      >
        {body}
      </motion.blockquote>
    </motion.figure>
  )
}

export function MarqueeDemo() {
  const [transformedReviews, setTransformedReviews] = useState<TransformedReview[]>([])

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data } = await axiosInstance.get("/api/reviews/publishable")
        if (data.status) {
          const transformedData = transformReviews(data.data)
          setTransformedReviews(transformedData)
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
      }
    }
    getReviews()
  }, [])


  const firstRow = transformedReviews.slice(0, Math.ceil(transformedReviews.length / 2))
  const secondRow = transformedReviews.slice(Math.ceil(transformedReviews.length / 2))

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6 py-12 bg-gradient-to-b from-sage-50/50 to-white dark:from-sage-950 dark:to-background"
    >

      <>
        <Marquee pauseOnHover className="[--duration:25s] [--gap:1.5rem]">
          {firstRow.map((review) => (
            <ReviewCard
              key={review.id}
              img={review.img}
              name={review.name}
              username={review.username}
              body={review.body}
            />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:25s] [--gap:1.5rem]">
          {secondRow.map((review) => (
            <ReviewCard
              key={`${review.id}-reverse`}
              img={review.img}
              name={review.name}
              username={review.username}
              body={review.body}
            />
          ))}
        </Marquee>
      </>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-background dark:via-background/80"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-background dark:via-background/80"></div>
    </motion.div>
  )
}