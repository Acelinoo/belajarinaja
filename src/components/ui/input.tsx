import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-2 border-black bg-white px-3 py-1 text-base text-foreground shadow-[2px_2px_0px_#121212] font-medium transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_#121212] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border dark:border-[#1C242D] dark:bg-[#090D12] dark:text-[#F1F5F9] dark:shadow-none dark:font-normal dark:placeholder:text-[#64748B] dark:focus-visible:border-cyan-400 dark:focus-visible:ring-1 dark:focus-visible:ring-cyan-400/30 dark:focus-visible:shadow-[0_0_10px_rgba(34,211,238,0.15)]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
