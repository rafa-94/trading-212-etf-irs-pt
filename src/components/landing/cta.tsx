import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"

interface CtaSectionProps {
  className?: string
}

export function CtaSection({ className }: CtaSectionProps) {
  return (
    <Section 
    className={cn("border-t border-fis-border py-[100px]", className)}
     contentClassName="text-center"
     title="COMECE AGORA">
      <div className="max-w-[640px] mx-auto">
        <h2 className="font-serif text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-fis-text mb-4">
          Pronto para declarar<br /><span className="italic text-fis-accent">sem dores de cabeça?</span>
        </h2>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          O Fiscus processa os seus ficheiros localmente, aplica as regras do IRS português e gera o XML para a AT. Grátis, privado, no browser.
        </p>

        <div className="flex flex-col items-center gap-4">
          <a
            href="/app"
            className="inline-flex items-center justify-center rounded-lg bg-fis-accent px-8 py-3 text-lg font-medium text-fis-bg hover:bg-fis-accent/90 transition-colors"
          >
            Abrir o Fiscus
          </a>
          <p className="font-mono text-muted-foreground mt-4">
            // Sem conta · Sem instalação · Dados 100% locais · Grátis
          </p>
        </div>
      </div>
    </Section>
  )
}
