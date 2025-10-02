import * as React from "react"
import { cn } from "@/lib/utils"
import { px } from "../utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const polyRoundness = 12
    const hypotenuse = polyRoundness * 2
    const hypotenuseHalf = polyRoundness / 2 - 1.5

    return (
      <div
        className="relative w-full"
        style={{
          "--poly-roundness": px(polyRoundness),
        } as React.CSSProperties}
      >
        {/* Diagonal corner borders */}
        <span
          data-border="top-left"
          style={
            {
              "--h": px(hypotenuse),
              "--hh": px(hypotenuseHalf),
            } as React.CSSProperties
          }
          className="absolute inline-block w-[var(--h)] top-[var(--hh)] left-[var(--hh)] h-[1px] -rotate-45 origin-top -translate-x-1/2 bg-border pointer-events-none z-10"
        />
        <span
          data-border="bottom-right"
          style={
            {
              "--h": px(hypotenuse),
              "--hh": px(hypotenuseHalf),
            } as React.CSSProperties
          }
          className="absolute w-[var(--h)] bottom-[var(--hh)] right-[var(--hh)] h-[1px] -rotate-45 translate-x-1/2 bg-border pointer-events-none z-10"
        />

        <input
          type={type}
          className={cn(
            "flex h-14 w-full border border-border bg-background px-4 py-3",
            "font-mono text-sm text-foreground placeholder:text-foreground/40",
            "transition-all duration-300 ease-out",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/20",
            "[clip-path:polygon(var(--poly-roundness)_0,calc(100%_-_var(--poly-roundness))_0,100%_0,100%_calc(100%_-_var(--poly-roundness)),calc(100%_-_var(--poly-roundness))_100%,0_100%,0_calc(100%_-_var(--poly-roundness)),0_var(--poly-roundness))]",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
