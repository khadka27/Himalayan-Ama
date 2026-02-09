"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface BlobCursorProps {
  blobType?: "circle" | "square";
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
}

export default function BlobCursor({
  blobType = "circle",
  fillColor = "var(--sage-500)",
  trailCount = 3,
  sizes = [40, 65, 50],
  innerSizes = [12, 20, 15],
  innerColor = "color-mix(in oklch, var(--cream) 85%, transparent)",
  opacities = [0.55, 0.4, 0.25],
  shadowColor = "color-mix(in oklch, var(--foreground) 40%, transparent)",
  shadowBlur = 10,
  shadowOffsetX = 4,
  shadowOffsetY = 4,
  filterId = "blob",
  filterStdDeviation = 18,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 25 -10",
  useFilter = true,
  fastDuration = 0.12,
  slowDuration = 0.55,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 100,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Initial positions
    blobsRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
    });

    const move = (e: MouseEvent) => {
      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          x: e.clientX,
          y: e.clientY,
          duration: i === 0 ? fastDuration : slowDuration,
          ease: i === 0 ? fastEase : slowEase,
        });
      });
    };

    const hoverHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!containerRef.current) return;
      if (target.closest("button, a, input, [data-no-cursor-hide]")) {
        containerRef.current.style.opacity = "0";
      } else {
        containerRef.current.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", hoverHandler);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", hoverHandler);
    };
  }, [fastDuration, slowDuration, fastEase, slowEase]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none transition-opacity duration-200"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={filterStdDeviation}
            />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="absolute inset-0 overflow-hidden select-none"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              blobsRef.current[i] = el;
            }}
            className="absolute will-change-transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === "circle" ? "50%" : "0",
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === "circle" ? "50%" : "0",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
