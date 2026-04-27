import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"
import { buttonVariants } from "../ui/button"
import { ArrowRight } from "lucide-react"

interface CtaSectionProps {
  className?: string
}

export function CtaSection({ className }: CtaSectionProps) {
  return (
    <Section
    className={cn("border-t border-border py-25", className)}
     contentClassName="text-center"
     title="COMECE AGORA">
      <div className="max-w-160 mx-auto">
        <h2 className="font-serif text-[clamp(1.9rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-foreground mb-4">
          Pronto para declarar<br /><span className="italic text-primary">sem dores de cabeça?</span>
        </h2>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          O Fiscus processa os seus ficheiros localmente, aplica as regras do IRS português e gera o XML para a AT. Grátis, privado, no browser.
        </p>

        <div className="flex flex-col items-center gap-4">
          <a
            href="/app"
            className={cn(buttonVariants({ variant: "default", size: "2xl" }), "font-bold hover:-translate-y-0.5 hover:shadow-[0_8px_32px_color-mix(in_oklch,var(--primary)_30%,transparent)]")}
          >
            <ArrowRight />
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
