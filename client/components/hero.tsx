import React from 'react'

export default function Hero({ badge, title, description, isReview, image }: { badge?: React.ReactNode, title?: React.ReactNode, description?: string, isReview?: boolean, image?: string }) {
  return (
    <section
      className="relative min-h-[260px] sm:min-h-[320px] md:min-h-[400px] h-auto overflow-hidden bg-slate-900 py-12 sm:py-16 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 bg-cover bg-center blur-[3px] scale-105"
        style={{
          backgroundImage: `url(${image || "https://images.unsplash.com/photo-1542314831-068cd1dbfe22?q=80&w=1794&auto=format&fit=crop"})`,
        }}
      />
      {/* Overlay with Backdrop Blur for high contrast & text readability */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />

      <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center z-10">
        {badge && (
          <span className="mb-2 sm:mb-4 text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-blue-200 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 backdrop-blur-md inline-block shadow-lg">
            {badge}
          </span>
        )}
        <h1 className="mb-2 sm:mb-4 md:mb-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] sm:leading-[1.05] drop-shadow-2xl tracking-tighter font-[family-name:var(--font-playful)]">
          <span className="text-white">{title}</span>
        </h1>
        <p className="max-w-2xl text-xs sm:text-base md:text-lg lg:text-xl text-white/95 font-medium drop-shadow-md leading-relaxed px-2">
          {description}
        </p>
      </div>
    </section>
  )
}
