"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-2 relative items-center mb-4",
                caption_label: "text-sm font-bold text-slate-900",
                nav: "flex items-center",
                button_previous: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity absolute left-1 z-10 rounded-full"
                ),
                button_next: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity absolute right-1 z-10 rounded-full"
                ),
                month_grid: "w-full border-collapse space-y-1",
                weekdays: "flex",
                weekday:
                    "text-slate-500 rounded-md w-12 font-bold text-[0.8rem] uppercase tracking-tighter text-center",
                week: "flex w-full mt-2",
                day: "h-12 w-12 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                day_button: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-12 w-12 p-0 font-medium transition-all rounded-xl hover:bg-blue-50 hover:text-blue-600"
                ),
                range_start: "bg-blue-600 text-white rounded-l-xl rounded-r-none shadow-lg shadow-blue-100 z-10",
                range_end: "bg-blue-600 text-white rounded-r-xl rounded-l-none shadow-lg shadow-blue-100 z-10",
                range_middle: "bg-blue-50 text-blue-900 rounded-none",
                selected: "bg-blue-600 text-white",
                today: "bg-slate-100 text-slate-900 font-bold",
                outside: "text-slate-400 opacity-50",
                disabled: "text-slate-400 opacity-50",
                hidden: "invisible",
                ...classNames,
            }}
            components={{
                Chevron: ({ orientation }) => {
                    const Icon = orientation === "left" ? ChevronLeft : ChevronRight
                    return <Icon className="h-4 w-4" />
                },
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
