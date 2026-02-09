"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-sage-50 to-sage-100 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(107, 142, 106, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(107, 142, 106, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(107, 142, 106, 0.12) 0%, transparent 40%)
          `,
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(107, 142, 106, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.h1
            className="text-[180px] md:text-[240px] font-bold text-sage-600/20 leading-none tracking-tighter select-none"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            404
          </motion.h1>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <svg
              className="w-32 h-32 md:w-40 md:h-40 text-sage-500"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M50 20 L50 50 L35 65"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-sage-800 tracking-tight">Lost in Meditation</h2>
          <p className="text-lg text-sage-700/80 leading-relaxed max-w-lg mx-auto text-balance">
            The page you're seeking has wandered off the path. Let's guide you back to your journey of inner peace.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
        >
          <Button
            size="lg"
            className="bg-sage-600 hover:bg-sage-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            onClick={() => router.push("/")}
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-sage-600 text-sage-700 hover:bg-sage-600 hover:text-white font-semibold px-8 transition-all bg-transparent"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pt-8 border-t border-sage-300/50"
        >
          <p className="text-sm text-sage-600 mb-4 font-medium">Explore our sanctuary:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/services"
              className="text-sage-700 hover:text-sage-900 transition-colors underline decoration-sage-300 hover:decoration-sage-600 underline-offset-4"
            >
              Classes
            </Link>
            <span className="text-sage-400">•</span>
            <Link
              href="/about"
              className="text-sage-700 hover:text-sage-900 transition-colors underline decoration-sage-300 hover:decoration-sage-600 underline-offset-4"
            >
              About Us
            </Link>
            <span className="text-sage-400">•</span>
            <Link
              href="/blog"
              className="text-sage-700 hover:text-sage-900 transition-colors underline decoration-sage-300 hover:decoration-sage-600 underline-offset-4"
            >
              Blog
            </Link>
            <span className="text-sage-400">•</span>
            <Link
              href="/contact"
              className="text-sage-700 hover:text-sage-900 transition-colors underline decoration-sage-300 hover:decoration-sage-600 underline-offset-4"
            >
              Contact
            </Link>
          </div>
        </motion.div>

        {/* Zen Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="pt-8"
        >
          <blockquote className="text-sage-600/70 italic text-sm max-w-md mx-auto">
            "Not all who wander are lost, but sometimes we need to find our way back."
          </blockquote>
        </motion.div>
      </div>

      {/* Floating elements for decoration */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-sage-300/20 blur-xl"
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-sage-400/20 blur-xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  )
}
