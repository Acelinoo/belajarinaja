import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-2 border-black bg-primary text-primary-foreground font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300 dark:shadow-none dark:font-mono",
        secondary:
          "border-2 border-black bg-secondary text-secondary-foreground font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#151B22] dark:text-[#CBD5E1] dark:shadow-none dark:font-mono",
        destructive:
          "border-2 border-black bg-destructive text-destructive-foreground font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:shadow-none dark:font-mono",
        outline:
          "border-2 border-black bg-white text-foreground font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#94A3B8] dark:shadow-none dark:font-mono",
        success:
          "border-2 border-black bg-[#7BE495] text-[#121212] font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:shadow-none dark:font-mono",
        warning:
          "border-2 border-black bg-[#FF9B54] text-[#121212] font-bold shadow-[2px_2px_0px_#121212] dark:border dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:shadow-none dark:font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
