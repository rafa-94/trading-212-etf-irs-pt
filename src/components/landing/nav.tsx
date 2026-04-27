"use client"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/landing/logo"

interface NavProps {
  className?: string
}

export function Nav({ className }: NavProps) {
  return (
    <nav className={cn("flex items-center gap-8 fixed top-0 left-0 right-0 z-50 h-16 justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md", className)}>
      <Logo />

      <div className="hidden md:flex items-center gap-8">
        <a href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Funcionalidades
        </a>
        <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Como Funciona
        </a>
        <a href="#privacidade" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Privacidade
        </a>
        <a href="#brokers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Brokers
        </a>
      </div>

      <a
        href="/app"
        className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2 text-sm font-medium transition-colors hover:opacity-90"
      >
        Começar Grátis
      </a>
    </nav>
  )
}
