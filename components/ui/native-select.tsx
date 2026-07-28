import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
  size?: "sm" | "default"
}

function NativeSelect({
  className,
  size = "default",
  ...props
}: NativeSelectProps) {
  return (
    <div className="relative inline-flex">
      <select
        data-slot="native-select"
        className={cn(
          "appearance-none rounded-md border border-input bg-muted/50 py-1 pr-7 pl-2 text-xs transition-colors outline-none select-none",
          "hover:bg-muted focus:border-ring focus:ring-2 focus:ring-ring/50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          size === "sm" && "h-7 text-[11px]",
          size === "default" && "h-8",
          className
        )}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      className={cn("bg-background text-foreground", className)}
      {...props}
    />
  )
}

function NativeSelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      className={cn("bg-background text-foreground", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
