"use client"

import { cn } from "@/lib/utils"

interface TrustItemProps {
  icon: React.ReactNode
  text: string
  className?: string
}

export function TrustItem({ icon, text, className }: TrustItemProps) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-fis-muted font-mono", className)}>
      <div className="text-fis-accent">{icon}</div>
      {text}
    </div>
  )
}
