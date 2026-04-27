import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"

interface StepCardProps {
  number: string
  title: string
  description: string
  details: string[]
}

export function StepCard({ number, title, description, details }: StepCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8  overflow-hidden hover:border-border/60">
      <div className="font-mono text-4xl font-bold text-muted-foreground/40 mb-5">{number}</div>
      <h3 className="font-serif text-lg font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>
      <div className="bg-background rounded-lg p-3 font-mono text-[0.7rem] text-primary leading-relaxed">
        {details.map((detail, i) => (
          <div key={i}>{detail}</div>
        ))}
      </div>
    </div>
  )
}

interface StepsGridProps {
  className?: string
}

export function StepsGrid({ className }: StepsGridProps) {
  return (
    <Section id="como-funciona" className={cn("border-t border-b border-border bg-card/30", className)} title="COMO FUNCIONA">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-foreground mb-4">
          Em três passos,<br />a declaração pronta
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Sem instalações, sem criar conta, sem enviar dados para servidores. Todo o processamento acontece directamente no seu browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StepCard
          number="01"
          title="Carregue o ficheiro"
          description="Exporte o CSV ou Excel do seu broker — Interactive Brokers, DEGIRO, Trading212, Revolut, eToro e mais. Ou importe directamente o XML da AT."
          details={["→ CSV, XLSX, XLS suportados", "→ Múltiplos brokers em simultâneo", "→ Detecção automática do formato"]}
        />
        <StepCard
          number="02"
          title="O motor calcula"
          description="O Fiscus aplica automaticamente as regras do IRS português: método FIFO, tratamento de split de ações, juros acumulados e retenções."
          details={["→ FIFO aplicado por ticker", "→ Regras específicas ETFs", "→ Verificação de consistência"]}
        />
        <StepCard
          number="03"
          title="Exporte para a AT"
          description="Visualize todos os valores calculados e exporte o XML do Modelo 3 pronto a submeter no Portal das Finanças, com os anexos J, E e G preenchidos."
          details={["→ Anexo J (Estrangeiro)", "→ Anexo E (Capitais)", "→ Anexo G (Mais-Valias)"]}
        />
      </div>
    </Section>
  )
}
