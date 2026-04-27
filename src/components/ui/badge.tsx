import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border",
  {
    variants: {
      variant: {
        default: "bg-[#0ddfaa] text-[#07111e] border-[#0ddfaa]",
        outline: "border-[#1c3352] text-[#7b95b0] hover:border-[#0ddfaa] hover:text-[#0ddfaa]",
        accent: "bg-[#0ddfaa22] text-[#0ddfaa] border-[#0ddfaa30]",
        gold: "bg-[#f5a62322] text-[#f5a623] border-[#f5a62330]",
      },
      size: {
        default: "h-8 px-3 text-xs font-mono",
        sm: "h-6 px-2 text-[0.65rem] font-mono",
        lg: "h-10 px-4 text-sm font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string
  children: React.ReactNode
}

export function Badge({ className, variant = "default", size = "default", children }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, className }))}>
      {children}
    </div>
  )
}

export { badgeVariants }
