import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-primary text-primary-foreground font-semibold shadow-xs",
        secondary:
          "border border-border bg-secondary text-secondary-foreground font-semibold shadow-xs",
        destructive:
          "border border-destructive/30 bg-destructive/15 text-destructive font-semibold shadow-xs",
        outline:
          "border border-border bg-card text-foreground font-semibold shadow-xs",
        success:
          "border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs",
        warning:
          "border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold shadow-xs",
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
