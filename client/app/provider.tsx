"use client"

import type React from "react"
import BlobCursor from "@/components/ui/blob"
import { Toaster } from "sonner"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Toaster richColors />
            <BlobCursor
                blobType="circle"
                fillColor="var(--sage-500)"
                innerColor="color-mix(in oklch, var(--cream) 85%, transparent)"
                shadowColor="color-mix(in oklch, var(--foreground) 40%, transparent)"
                trailCount={5}
                sizes={[40, 65, 50, 40, 30]}
                innerSizes={[12, 20, 15, 12, 10]}
                opacities={[0.55, 0.4, 0.25, 0.15, 0.1]}
                shadowBlur={10}
                shadowOffsetX={4}
                shadowOffsetY={4}
                filterStdDeviation={18}
                filterColorMatrixValues="1 0 0 0 0
                           0 1 0 0 0
                           0 0 1 0 0
                           0 0 0 25 -10"
                useFilter={true}
                fastDuration={0.12}
                slowDuration={0.55}
                zIndex={100}
            />


            {children}
        </>
    )

}
