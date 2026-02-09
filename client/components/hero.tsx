import React from 'react'

export default function Hero({title,description, isReview, image}: {title?: string,description?: string, isReview?: boolean, image?: string}) {
  return (
      <section
        className="relative h-[400px] overflow-hidden"
        style={{
          backgroundImage: `
    linear-gradient(
      rgba(90, 122, 89, 0.2),
      rgba(90, 122, 89, 0.2)
    ),
    url(${image || "/placeholder.svg?height=400&width=1920&query=yoga meditation peaceful nature"})
  `,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-[#627A64]/40" />
        <div className="relative container mx-auto flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold text-balance text-[#e8d5b7]">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            {description}
          </p>
        </div>
      </section>
  )
}
