import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useRecoilValue } from "recoil"
import { loadingState } from "@/app/state/atoms/atom"
import { ClipLoader } from "react-spinners"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 relative"
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, asChild = false, ...props }, ref) => {
    const isLoading: boolean = useRecoilValue(loadingState);
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ className }))}
        ref={ref}
        {...props}
        disabled={isLoading}
      >
        {isLoading &&
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <ClipLoader
              color="#000"
              loading={isLoading}
              size={25}
              aria-label="Loading Spinner"
              className=""
            />
          </div>
        }
        
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
