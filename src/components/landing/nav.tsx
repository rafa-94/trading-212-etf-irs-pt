"use client"

import { cn } from "@/lib/utils"
import { Logo } from "@/components/landing/logo"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

interface NavProps {
  className?: string
}

export function Nav({ className }: NavProps) {
  return (
    <nav className={cn("flex items-center gap-8 fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-8 border-b border-fis-border bg-fis-bg/82 backdrop-blur-md", className)}>
      <Logo />

      <div className="hidden md:flex items-center gap-8">
        <a href="#funcionalidades" className="text-sm font-medium text-fis-muted hover:text-fis-text transition-colors">
          Funcionalidades
        </a>
        <a href="#como-funciona" className="text-sm font-medium text-fis-muted hover:text-fis-text transition-colors">
          Como Funciona
        </a>
        <a href="#privacidade" className="text-sm font-medium text-fis-muted hover:text-fis-text transition-colors">
          Privacidade
        </a>
        <a href="#brokers" className="text-sm font-medium text-fis-muted hover:text-fis-text transition-colors">
          Brokers
        </a>
      </div>

      <a
        href="/app"
        className="inline-flex items-center justify-center rounded-lg bg-fis-accent px-5 py-2 text-sm font-medium text-fis-bg hover:bg-fis-accent/90 transition-colors"
      >
        Começar Grátis
      </a>
    </nav>
  )
}
