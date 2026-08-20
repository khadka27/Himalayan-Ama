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
  fillColor = "rgba(59, 130, 246, 0.25)",
  trailCount = 3,
  sizes = [36, 24, 16],
  innerSizes = [8, 6, 4],
  innerColor = "rgba(255, 255, 255, 0.8)",
  opacities = [0.6, 0.4, 0.2],
  shadowColor = "rgba(59, 130, 246, 0.2)",
  shadowBlur = 12,
  shadowOffsetX = 0,
  shadowOffsetY = 0,
  filterId = "blob",
  filterStdDeviation = 12,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7",
  useFilter = false,
  fastDuration = 0.1,
  slowDuration = 0.4,
  fastEase = "power3.out",
  slowEase = "power1.out",
  zIndex = 100,
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Respect reduced motion & touch devices
    if (typeof window === "undefined") return;
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
      if (target.closest("button, a, input, textarea, select, [data-no-cursor-hide]")) {
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
        className="absolute inset-0 overflow-hidden select-none pointer-events-none"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => {
          const currentSize = sizes[i] ?? sizes[sizes.length - 1] ?? 36;
          const currentInnerSize = innerSizes[i] ?? innerSizes[innerSizes.length - 1] ?? 8;
          const currentOpacity = opacities[i] ?? opacities[opacities.length - 1] ?? 0.5;

          return (
            <div
              key={i}
              ref={(el) => {
                blobsRef.current[i] = el;
              }}
              className="absolute will-change-transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: currentSize,
                height: currentSize,
                borderRadius: blobType === "circle" ? "50%" : "0",
                backgroundColor: fillColor,
                opacity: currentOpacity,
                boxShadow: shadowBlur > 0 ? `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}` : "none",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  width: currentInnerSize,
                  height: currentInnerSize,
                  top: (currentSize - currentInnerSize) / 2,
                  left: (currentSize - currentInnerSize) / 2,
                  backgroundColor: innerColor,
                  borderRadius: blobType === "circle" ? "50%" : "0",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
