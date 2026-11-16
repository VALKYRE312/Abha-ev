import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-space-cadet text-white hover:bg-space-cadet-700 active:bg-space-cadet-900 shadow-sm hover:shadow-brand",
        primary: "bg-tan text-space-cadet hover:bg-tan-500 active:bg-tan-600 shadow-sm hover:shadow-tan font-bold",
        accent: "bg-caput-mortuum text-white hover:bg-caput-mortuum-700 active:bg-caput-mortuum-900 shadow-sm hover:shadow-lg font-bold",
        destructive:
          "bg-caput-mortuum text-white hover:bg-caput-mortuum-700 active:bg-caput-mortuum-900 shadow-sm",
        outline:
          "border-2 border-space-cadet bg-transparent text-space-cadet hover:bg-space-cadet hover:text-white",
        secondary:
          "bg-slate-gray text-white hover:bg-slate-gray-600 active:bg-slate-gray-700 shadow-sm",
        ghost: "hover:bg-tan/10 hover:text-space-cadet",
        link: "text-space-cadet underline-offset-4 hover:underline hover:text-tan",
        warning: "bg-coffee text-white hover:bg-coffee-600 active:bg-coffee-800 shadow-sm",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-11 w-11",
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
