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
                fillColor="rgba(59, 130, 246, 0.25)"
                innerColor="rgba(255, 255, 255, 0.9)"
                shadowColor="rgba(59, 130, 246, 0.2)"
                trailCount={3}
                sizes={[36, 24, 16]}
                innerSizes={[8, 6, 4]}
                opacities={[0.6, 0.4, 0.2]}
                shadowBlur={12}
                shadowOffsetX={0}
                shadowOffsetY={0}
                useFilter={false}
                fastDuration={0.1}
                slowDuration={0.4}
                zIndex={100}
            />

            {children}
        </>
    )
}
