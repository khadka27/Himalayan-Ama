"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

type Testimonial = {
  bio: string;
  name: string;
  profession: string;
  image_url: string;
};

export const AnimatedTestimonials = ({
  testimonials = [],
  autoplay = false,
}: {
  testimonials?: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Initialize state after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    if (testimonials.length > 0) {
      setActive((prev) => (prev + 1) % testimonials.length);
    }
  };

  const handlePrev = () => {
    if (testimonials.length > 0) {
      setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay && testimonials.length > 1) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  // Guard clause for empty testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
        <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
          <div className="flex h-80 w-full items-center justify-center rounded-3xl bg-gray-100 dark:bg-neutral-800">
            <p className="text-gray-500 dark:text-neutral-400">No instructors available</p>
          </div>
          <div className="flex flex-col justify-between py-4">
            <div>
              <h3 className="text-2xl font-bold text-[#6b8e6a] dark:text-white">
                No Instructor
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                Please add instructors
              </p>
              <p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
                Instructors will appear here once added.
              </p>
            </div>
            <div className="flex gap-4 pt-12 md:pt-0">
              <button
                disabled
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 opacity-50 dark:bg-neutral-800"
              >
                <IconArrowLeft className="h-5 w-5 text-black dark:text-neutral-400" />
              </button>
              <button
                disabled
                className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 opacity-50 dark:bg-neutral-800"
              >
                <IconArrowRight className="h-5 w-5 text-black dark:text-neutral-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Safe access to active testimonial
  const activeTestimonial = testimonials[active];

  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.image_url + index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  {testimonial.image_url ? (
                    <Image
                      src={testimonial.image_url}
                      alt={testimonial.name || `Testimonial ${index + 1}`}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gray-200 dark:bg-neutral-700">
                      <span className="text-gray-500 dark:text-neutral-400">
                        No Image
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          {mounted && activeTestimonial && (
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-2xl font-bold text-[#6b8e6a] dark:text-white">
                {activeTestimonial.name || "Instructor"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-500">
                {activeTestimonial.profession || "Professional"}
              </p>
              <motion.p className="mt-8 text-lg text-gray-500 dark:text-neutral-300">
                {(activeTestimonial.bio || "No bio available")
                  .split(" ")
                  .map((word, index) => (
                    <motion.span
                      key={`${active}-${index}`}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                        delay: 0.02 * index,
                      }}
                      className="inline-block"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
              </motion.p>
            </motion.div>
          )}
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              disabled={testimonials.length <= 1}
              className={`group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 ${testimonials.length <= 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200 dark:hover:bg-neutral-700"
                }`}
              aria-label="Previous testimonial"
            >
              <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 dark:text-neutral-400" />
            </button>
            <button
              onClick={handleNext}
              disabled={testimonials.length <= 1}
              className={`group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 ${testimonials.length <= 1
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-200 dark:hover:bg-neutral-700"
                }`}
              aria-label="Next testimonial"
            >
              <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 dark:text-neutral-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};