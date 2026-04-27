import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"

type IconVariant = "green" | "gold" | "blue" | "purple"

const iconVariantClass: Record<IconVariant, string> = {
  green:  "bg-primary/10 text-primary",
  gold:   "bg-amber-400/10 text-amber-400",
  blue:   "bg-blue-400/10 text-blue-400",
  purple: "bg-violet-400/10 text-violet-400",
}

interface FeatureCardProps {
  icon: React.ReactNode
  iconVariant: IconVariant
  title: string
  description: string
  tags: string[]
}

export function FeatureCard({ icon, iconVariant, title, description, tags }: FeatureCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 transition-all hover:border-border/60 hover:-translate-y-1 hover:bg-accent">
      <div className={cn("w-12 h-12 rounded-3xl flex items-center justify-center mb-5 text-xl", iconVariantClass[iconVariant])}>
        {icon}
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground mb-3">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="font-mono text-[0.65rem] px-2 py-1 rounded border border-border text-muted-foreground tracking-wide">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

interface FeaturesGridProps {
  className?: string
}

export function FeaturesGrid({ className }: FeaturesGridProps) {
  return (
    <Section id="funcionalidades" className={cn("border-t border-border", className)} title="FUNCIONALIDADES">
      <div className="flex flex-col items-start gap-4 mb-14">
        <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-foreground">
          Tudo o que precisa de declarar,<br />calculado automaticamente
        </h2>
        <p className="text-base text-muted-foreground max-w-130 leading-relaxed">
          O Fiscus suporta todos os tipos de rendimentos de capitais e mais-valias exigidos pelo Modelo 3 da AT.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon="📈"
          iconVariant="green"
          title="Ações & ETFs"
          description="Cálculo automático de mais e menos-valias com método FIFO. Lotes de compra, datas, comissões e custo de aquisição ajustado."
          tags={["FIFO", "Custo Médio", "Comissões", "Lotes"]}
        />
        <FeatureCard
          icon="💰"
          iconVariant="gold"
          title="Dividendos"
          description="Listagem completa de todos os pagamentos de dividendos com datas, valores brutos, retenção na fonte e país de origem."
          tags={["Ret. Fonte", "País Origem", "Totais"]}
        />
        <FeatureCard
          icon="🏦"
          iconVariant="blue"
          title="Juros"
          description="Juros de obrigações, depósitos e contas poupança. Datas de pagamento, taxas aplicadas e retenção já deduzida pelo broker."
          tags={["Obrigações", "Depósitos", "Poupança"]}
        />
        <FeatureCard
          icon="₿"
          iconVariant="purple"
          title="Criptomoedas"
          description="Rastreio de compras e vendas de cripto com aplicação automática de FIFO. Ganhos, perdas, taxas de gas e conversões."
          tags={["FIFO Crypto", "Gas Fees", "Conversões", "DeFi"]}
        />
      </div>
    </Section>
  )
}
