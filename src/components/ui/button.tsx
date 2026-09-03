import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-primary text-primary-foreground font-bold shadow-xs hover:bg-primary/80 active:scale-[0.98] transition-all dark:border dark:border-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] dark:shadow-none dark:hover:bg-[#E5E5E5] dark:hover:text-[#000000] dark:hover:border-[#FFFFFF] dark:hover:translate-x-0 dark:hover:translate-y-0 dark:active:translate-x-0 dark:active:translate-y-0 dark:font-bold",
        destructive:
          "border border-destructive/20 bg-destructive text-destructive-foreground font-bold shadow-xs hover:bg-destructive/90 active:scale-[0.98] transition-all dark:border dark:border-[#444444] dark:bg-[#222222] dark:text-[#FFFFFF] dark:shadow-none dark:hover:bg-[#333333] dark:hover:text-[#FFFFFF]",
        outline:
          "border border-border bg-card text-foreground font-semibold shadow-xs hover:bg-secondary active:scale-[0.98] transition-all dark:border dark:border-[#222222] dark:bg-[#0A0A0A] dark:text-[#CCCCCC] dark:shadow-none dark:hover:bg-[#171717] dark:hover:text-[#FFFFFF] dark:hover:border-[#444444]",
        secondary:
          "border border-border bg-secondary text-secondary-foreground font-semibold shadow-xs hover:bg-secondary/80 active:scale-[0.98] transition-all dark:border dark:border-[#222222] dark:bg-[#171717] dark:text-[#FAFAFA] dark:shadow-none dark:hover:bg-[#222222] dark:hover:text-[#FFFFFF] dark:hover:border-[#333333]",
        ghost:
          "hover:bg-secondary hover:text-foreground transition-colors dark:hover:bg-[#171717] dark:hover:text-[#FFFFFF]",
        link: "text-primary underline-offset-4 hover:underline font-bold dark:text-[#FFFFFF] dark:hover:text-[#CCCCCC] dark:font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 font-bold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
