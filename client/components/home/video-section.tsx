"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Check, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoSection() {
    const router = useRouter()
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [progress, setProgress] = useState(0)
    const [showControls, setShowControls] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)
    const playerRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { amount: 0.3 })

    useEffect(() => {
        if (videoRef.current) {
            if (!isInView) {
                videoRef.current.pause()
                setIsPlaying(false)
            }
        }
    }, [isInView])

    const togglePlay = async () => {
        if (videoRef.current) {
            try {
                if (isPlaying) {
                    videoRef.current.pause()
                } else {
                    await videoRef.current.play()
                }
                setIsPlaying(!isPlaying)
            } catch (error) {
                console.error("Video playback failed:", error)
            }
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.duration) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
            setProgress(isNaN(currentProgress) ? 0 : currentProgress)
        }
    }

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current && videoRef.current.duration) {
            const newProgress = Number(e.target.value)
            const newTime = (newProgress / 100) * videoRef.current.duration
            videoRef.current.currentTime = newTime
            setProgress(newProgress)
        }
    }

    const handleFullscreen = () => {
        if (playerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                playerRef.current.requestFullscreen()
            }
        }
    }

    return (
        <section
            ref={containerRef}
            className="py-32 bg-white overflow-hidden"
        >
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-24">
                    {/* Left Side: Content */}
                    <motion.div
                        className="flex-1 space-y-10"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-widest border border-blue-100">
                                <Sparkles className="h-4 w-4" />
                                <span>Curated Residences</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                                Live Where Luxury <br />
                                <span className="text-blue-500">Meets Serenity</span>
                            </h2>
                        </div>

                        <p className="text-xl text-gray-500 leading-relaxed font-medium max-w-xl">
                            Discover the essence of Nepalese hospitality in our premium apartments. Located in the most tranquil areas of Pokhara, we offer more than just a place to stay—we provide a lifestyle defined by peace and comfort.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            {[
                                "Scenic Mountain Views",
                                "Fully Furnished Interiors",
                                "24/7 Dedicated Concierge",
                                "Modern Amenities",
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 group-hover:scale-110 transition-transform">
                                        <Check className="h-5 w-5" />
                                    </div>
                                    <span className="text-gray-900 font-bold text-lg">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Button
                                className="bg-blue-500 text-white hover:bg-blue-600 transition-all px-12 py-8 text-lg font-bold rounded-[20px] shadow-2xl shadow-blue-100 hover:scale-105 active:scale-95"
                                onClick={() => router.push("/apartments")}
                            >
                                <Home className="mr-3 h-5 w-5" />
                                Find Your Suite
                            </Button>
                        </div>
                    </motion.div>

                    {/* Right Side: Video Player */}
                    <motion.div
                        className="flex-1 relative w-full max-w-[450px] aspect-[9/16] mx-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div className="absolute -inset-10 bg-blue-500/5 blur-[100px] rounded-full" />

                        <div
                            ref={playerRef}
                            className="group relative w-full h-full rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(30,58,138,0.2)] border-[12px] border-white bg-slate-100"
                            onMouseEnter={() => setShowControls(true)}
                            onMouseLeave={() => isPlaying && setShowControls(false)}
                        >
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                onTimeUpdate={handleTimeUpdate}
                                onClick={togglePlay}
                                playsInline
                                muted={isMuted}
                                loop
                                preload="auto"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                            >
                                <source src="/intro.mp4" type="video/mp4" />
                            </video>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                            <AnimatePresence>
                                {showControls && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col justify-between p-10"
                                    >
                                        <div className="flex justify-end">
                                            <button
                                                onClick={toggleMute}
                                                className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 text-white flex items-center justify-center hover:bg-white/40 transition-all"
                                            >
                                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                            </button>
                                        </div>

                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <motion.button
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={togglePlay}
                                                className="h-24 w-24 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-2xl relative"
                                            >
                                                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20" />
                                                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} className="ml-1" fill="currentColor" />}
                                            </motion.button>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer relative group/progress">
                                                <motion.div
                                                    className="absolute h-full bg-blue-400 group-hover/progress:bg-white transition-colors"
                                                    style={{ width: `${progress}%` }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={progress}
                                                    onChange={handleProgressChange}
                                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-white/70 text-xs font-bold uppercase tracking-widest">
                                                <span>Cinema View</span>
                                                <button onClick={handleFullscreen} className="hover:text-white transition-colors">
                                                    <Maximize size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            className="absolute -top-10 -right-10 h-32 w-32 bg-white rounded-[40px] shadow-2xl flex items-center justify-center border border-blue-50"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="text-center">
                                <span className="block text-3xl font-bold text-blue-500 leading-none mb-1">Live</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tour</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
