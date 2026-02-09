"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize, Sparkles, Check } from "lucide-react"
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
            if (isInView) {
                // We don't necessarily want to autoplay if that's not desired, 
                // but often for these cinematic sections we do.
                // For performance, we only load/play when in view.
            } else {
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
            className="py-24 bg-gradient-to-b from-white to-[#FAF8F3] overflow-hidden"
        >
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Side: Content */}
                    <motion.div
                        className="flex-1 space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-2 text-[#8C9E8B] text-sm font-medium">
                            <Sparkles className="h-4 w-4" />
                            Experience Harmony
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1]">
                            Himalayan Yoga for <br />
                            <span className="text-[#6B8E6A]">Modern Life</span>
                        </h2>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                            Yoga at Himalayan Yogini combines traditional asana, pranayama, meditation, and conscious living. Our approach reflects the essence of Himalayan yoga, focusing on awareness rather than performance while supporting the natural connection between yoga and exercise.
                        </p>

                        <div className="space-y-3 pt-2">
                            {[
                                "Small group yoga classes in Nepal",
                                "Supportive yoga studio",
                                "Suitable for yoga beginners",
                                "Experienced yoga instructors",
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-[#FAF8F3] flex items-center justify-center border border-[#6B8E6A]/20">
                                        <Check className="h-3.5 w-3.5 text-[#6B8E6A]" />
                                    </div>
                                    <span className="text-gray-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* <Button
                            className="bg-[#6B8E6A] text-white hover:bg-[#5A7A59] transition-all px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1"
                            onClick={() => router.push("/services")}
                        >
                            Explore Our Program
                        </Button> */}
                    </motion.div>

                    {/* Right Side: Video Player */}
                    <motion.div
                        className="flex-1 relative w-full max-w-[360px] lg:max-w-[400px] aspect-[9/16] perspective-1000 mx-auto"
                        initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Decorative Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-[#6B8E6A]/20 to-transparent blur-3xl opacity-50 rounded-[40px] -z-10" />

                        <div
                            ref={playerRef}
                            className="group relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl border-[8px] border-white bg-black video-container-fullscreen"
                            onMouseEnter={() => setShowControls(true)}
                            onMouseLeave={() => isPlaying && setShowControls(false)}
                        >
                            {/* The Video Element */}
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover"
                                // poster="https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                onTimeUpdate={handleTimeUpdate}
                                onClick={togglePlay}
                                playsInline
                                muted={isMuted}
                                loop
                                preload="auto"
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onError={(e) => console.error("Video error:", e)}
                            >
                                <source src="/intro.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Permanent Softening Overlay */}
                            <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />

                            {/* Overlay Controls */}
                            <AnimatePresence>
                                {showControls && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex flex-col justify-between p-6 z-20"
                                    >
                                        {/* Top Bar */}
                                        <div className="flex justify-start">
                                            <button
                                                onClick={toggleMute}
                                                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all relative z-10"
                                            >
                                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                            </button>
                                        </div>

                                        {/* Play Button (Center) */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={togglePlay}
                                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl"
                                            >
                                                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                            </motion.button>
                                        </div>

                                        {/* Bottom Controls */}
                                        <div className="space-y-4">
                                            {/* Progress Bar */}
                                            <div className="relative h-1.5 w-full bg-white/20 rounded-full overflow-hidden group/progress cursor-pointer">
                                                <motion.div
                                                    className="absolute h-full bg-[#6B8E6A]"
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

                                            <div className="flex items-center justify-between text-white text-sm font-medium">
                                                <div className="flex items-center gap-4">
                                                    <span className="bg-white/10 px-2 py-0.5 rounded border border-white/10 backdrop-blur-sm">
                                                        4K Portrait
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={handleFullscreen}
                                                    className="hover:text-[#6B8E6A] transition-colors"
                                                >
                                                    <Maximize size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Status Indicator (only show when playing and controls hidden) */}
                            {!showControls && isPlaying && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute bottom-6 right-6 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white/70"
                                >
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(i => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [4, 12, 4] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                                className="w-0.5 bg-[#6B8E6A]"
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Float Elements */}
                        <motion.div
                            className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 hidden md:flex"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="text-center">
                                <span className="block text-xl font-bold text-[#6B8E6A]">Live</span>
                                <span className="text-[10px] uppercase tracking-tighter text-gray-400">Recording</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
