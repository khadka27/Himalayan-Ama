"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)
          `,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-12">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.h1
            className="text-[180px] md:text-[240px] font-bold text-blue-500/5 leading-none tracking-tighter select-none font-serif"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
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
            <div className="relative">
              <div className="h-40 w-40 md:h-56 md:w-56 rounded-[50px] bg-white shadow-2xl flex items-center justify-center border border-gray-50 transform rotate-12">
                <Search className="w-20 h-20 md:w-24 md:h-24 text-blue-500/20" />
              </div>
              <motion.div
                className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">Lost in the <span className="text-blue-500">Himalayas?</span></h2>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg mx-auto">
            The residence you are looking for has been moved or is currently off the market. Let's find you another beautiful sanctuary.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
        >
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 shadow-2xl shadow-blue-100 transition-all hover:scale-110 rounded-2xl h-16 text-lg"
            onClick={() => router.push("/")}
          >
            <Home className="w-6 h-6 mr-3" />
            Go Home
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-gray-400 hover:text-blue-500 font-bold px-10 transition-all rounded-2xl h-16 text-lg border-2 border-transparent hover:border-blue-100 hover:bg-blue-50"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            Step Back
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pt-16 border-t border-gray-100"
        >
          <div className="flex flex-wrap gap-8 justify-center text-sm font-bold uppercase tracking-[0.2em] text-gray-300">
            <Link href="/apartments" className="hover:text-blue-500 transition-colors">Residences</Link>
            <Link href="/about" className="hover:text-blue-500 transition-colors">Our Story</Link>
            <Link href="/blog" className="hover:text-blue-500 transition-colors">Journal</Link>
            <Link href="/contact" className="hover:text-blue-500 transition-colors">Concierge</Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blobs */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-100/30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-blue-50/50 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
    </div>
  )
}
