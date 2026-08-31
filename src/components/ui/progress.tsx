"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_#121212] dark:h-2 dark:rounded-full dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:shadow-none",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-out border-r-2 border-black dark:border-r-0 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 dark:shadow-[0_0_8px_rgba(34,211,238,0.4)]"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
