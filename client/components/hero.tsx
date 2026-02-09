import React from 'react'

export default function Hero({ title, description, isReview, image }: { title?: string, description?: string, isReview?: boolean, image?: string }) {
  return (
    <section
      className="relative h-[450px] overflow-hidden bg-blue-50"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${image || "https://images.unsplash.com/photo-1542314831-068cd1dbfe22?q=80&w=1794&auto=format&fit=crop"})`,
        }}
      />
      {/* Light Sky Blue Overlay for readability without being dark */}
      <div className="absolute inset-0 bg-blue-400/20" />

      <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-6 text-4xl md:text-5xl font-bold text-white drop-shadow-md tracking-tight">
          {title}
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-white font-medium drop-shadow-sm">
          {description}
        </p>
      </div>
    </section>
  )
}
