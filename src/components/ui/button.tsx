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
          "border-2 border-black bg-primary text-primary-foreground font-bold shadow-[3px_3px_0px_#121212] hover:shadow-[4px_4px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#121212] dark:border dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-300 dark:shadow-none dark:hover:bg-cyan-400 dark:hover:text-[#05070A] dark:hover:border-cyan-400 dark:hover:shadow-[0_0_15px_rgba(34,211,238,0.35)] dark:hover:translate-x-0 dark:hover:translate-y-0 dark:active:translate-x-0 dark:active:translate-y-0 dark:font-semibold",
        destructive:
          "border-2 border-black bg-destructive text-destructive-foreground font-bold shadow-[3px_3px_0px_#121212] hover:shadow-[4px_4px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#121212] dark:border dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-400 dark:shadow-none dark:hover:bg-red-500 dark:hover:text-white dark:hover:border-red-500 dark:hover:shadow-[0_0_15px_rgba(239,68,68,0.35)] dark:hover:translate-x-0 dark:hover:translate-y-0 dark:active:translate-x-0 dark:active:translate-y-0 dark:font-semibold",
        outline:
          "border-2 border-black bg-white text-foreground font-bold shadow-[3px_3px_0px_#121212] hover:bg-[#EAE4D5] hover:shadow-[4px_4px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#0F141A] dark:text-[#CBD5E1] dark:shadow-none dark:hover:bg-[#151B22] dark:hover:text-cyan-300 dark:hover:border-cyan-500/40 dark:hover:shadow-[0_0_12px_rgba(34,211,238,0.15)] dark:hover:translate-x-0 dark:hover:translate-y-0 dark:active:translate-x-0 dark:active:translate-y-0 dark:font-medium",
        secondary:
          "border-2 border-black bg-secondary text-secondary-foreground font-bold shadow-[3px_3px_0px_#121212] hover:shadow-[4px_4px_0px_#121212] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#121212] dark:border dark:border-[#1C242D] dark:bg-[#151B22] dark:text-[#F1F5F9] dark:shadow-none dark:hover:bg-[#1C242D] dark:hover:text-white dark:hover:border-[#26313C] dark:hover:translate-x-0 dark:hover:translate-y-0 dark:active:translate-x-0 dark:active:translate-y-0 dark:font-medium",
        ghost:
          "hover:bg-[#EAE4D5] hover:text-foreground dark:hover:bg-[#151B22] dark:hover:text-cyan-300",
        link: "text-primary underline-offset-4 hover:underline font-bold dark:text-cyan-400 dark:hover:text-cyan-300 dark:font-medium",
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
