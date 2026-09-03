import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-primary text-primary-foreground font-bold dark:border dark:border-[#333333] dark:bg-[#111111] dark:text-[#FFFFFF] dark:shadow-none dark:font-mono",
        secondary:
          "border border-border bg-secondary text-secondary-foreground font-semibold dark:border dark:border-[#222222] dark:bg-[#171717] dark:text-[#CCCCCC] dark:shadow-none dark:font-mono",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive font-semibold dark:border dark:border-[#444444] dark:bg-[#222222] dark:text-[#FFFFFF] dark:shadow-none dark:font-mono",
        outline:
          "border border-border bg-card text-foreground font-semibold dark:border dark:border-[#222222] dark:bg-[#050505] dark:text-[#888888] dark:shadow-none dark:font-mono",
        success:
          "border border-emerald-500/30 bg-emerald-50 text-emerald-800 font-bold dark:border dark:border-[#333333] dark:bg-[#111111] dark:text-[#FFFFFF] dark:shadow-none dark:font-mono",
        warning:
          "border border-[#FFDDAE] bg-[#FFDDAE]/40 text-amber-900 font-bold dark:border dark:border-[#333333] dark:bg-[#111111] dark:text-[#FFFFFF] dark:shadow-none dark:font-mono",
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
