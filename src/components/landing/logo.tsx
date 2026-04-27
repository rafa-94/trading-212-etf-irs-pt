import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <a href="#" className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
        <svg viewBox="0 0 18 18" fill="none" className="h-[18px] w-[18px]">
          <path d="M3 14L9 4L15 14H3Z" fill="currentColor" stroke="none" />
          <path
            d="M2 13.5H16M9 4V4.5M5 11H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="font-serif font-bold text-lg tracking-tight text-slate-100">
        Fiscus
      </span>
    </a>
  )
}
