import { cn } from "@/lib/utils"

interface FooterLinksProps {
  className?: string
}

export function FooterLinks({ className }: FooterLinksProps) {
  return (
    <ul className={cn("flex gap-6 list-none text-sm text-fis-faint", className)}>
      <li>
        <a href="#" className="hover:text-fis-muted transition-colors">Privacidade</a>
      </li>
      <li>
        <a href="#" className="hover:text-fis-muted transition-colors">Termos</a>
      </li>
      <li>
        <a href="#" className="hover:text-fis-muted transition-colors">Suporte</a>
      </li>
      <li>
        <a href="#" className="hover:text-fis-muted transition-colors">GitHub</a>
      </li>
    </ul>
  )
}

interface PortugalFlagProps {
  className?: string
}

export function PortugalFlag({ className }: PortugalFlagProps) {
  return (
    <div className={cn("flex items-center gap-2 font-mono text-[0.72rem] text-fis-faint", className)}>
      <div className="flex overflow-hidden rounded-sm">
        <span className="w-2 h-3 bg-[#006600]"></span>
        <span className="w-3 h-3 bg-[#ff0000]"></span>
      </div>
      <span>Construído para o IRS português</span>
    </div>
  )
}

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t border-fis-border px-8 h-16 flex flex-col md:flex-row justify-between items-center gap-6", className)}>
      <div className="text-sm text-fis-faint">© 2024 Fiscus. Feito em Portugal.</div>
      <PortugalFlag />
      <FooterLinks />
    </footer>
  )
}
