import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border-2 border-black bg-white px-3 py-1 text-base text-foreground shadow-[2px_2px_0px_#121212] font-medium transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 focus-visible:outline-none focus-visible:shadow-[4px_4px_0px_#121212] focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-input dark:bg-card dark:shadow-sm dark:font-normal dark:placeholder:text-muted-foreground dark:focus-visible:ring-1 dark:focus-visible:ring-ring dark:focus-visible:shadow-none",
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
