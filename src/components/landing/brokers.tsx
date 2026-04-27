import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"

interface BrokerCardProps {
  name: string
  format: string
  initials: string
  color?: string
  isGeneric?: boolean
}

export function BrokerCard({ name, format, initials, color, isGeneric }: BrokerCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-lg p-5 text-center transition-colors hover:border-border/60", isGeneric && "border-dashed")}>
      {isGeneric ? (
        <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center font-bold text-xs font-mono bg-primary/10 text-primary">
          {initials}
        </div>
      ) : (
        <div
          className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center font-bold text-xs font-mono"
          style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
        >
          {initials}
        </div>
      )}
      <div className={cn("font-medium text-sm mb-1", isGeneric ? "text-muted-foreground" : "text-foreground")}>{name}</div>
      <div className="font-mono text-[0.65rem] text-muted-foreground">{format}</div>
    </div>
  )
}

interface BrokersSectionProps {
  className?: string
}

export function BrokersSection({ className }: BrokersSectionProps) {
  const brokers = [
    { name: "Interactive Brokers", format: "CSV · FLEX", initials: "IB", color: "var(--broker-interactive-brokers)" },
    { name: "DEGIRO",              format: "CSV",         initials: "DE", color: "var(--broker-degiro)" },
    { name: "Trading 212",         format: "CSV",         initials: "T2", color: "var(--broker-trading-212)" },
    { name: "Revolut",             format: "CSV · PDF",   initials: "RV", color: "var(--broker-revolut)" },
    { name: "eToro",               format: "XLSX",        initials: "ET", color: "var(--broker-etoro)" },
    { name: "XTB",                 format: "CSV",         initials: "XS", color: "var(--broker-xtb)" },
    { name: "Saxo Bank",           format: "CSV · XLS",   initials: "SX", color: "var(--broker-saxo-bank)" },
    { name: "Coinbase",            format: "CSV",         initials: "CB", color: "var(--broker-coinbase)" },
    { name: "Binance",             format: "CSV",         initials: "BN", color: "var(--broker-binance)" },
  ]

  return (
    <Section id="brokers" className={cn("border-t border-border", className)} title="BROKERS SUPORTADOS">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <h2 className="font-serif text-[1.8rem] font-bold tracking-tight text-foreground">
          Compatível com os principais<br />brokers usados em Portugal
        </h2>
        <p className="text-muted-foreground text-sm max-w-70 text-right leading-relaxed">
          Não encontra o seu broker? O formato CSV genérico aceita qualquer exportação com colunas de data, ticker, quantidade e preço.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {brokers.map((broker) => (
          <BrokerCard
            key={broker.name}
            name={broker.name}
            format={broker.format}
            initials={broker.initials}
            color={broker.color}
          />
        ))}
        <BrokerCard
          name="Outro broker"
          format="CSV Genérico"
          initials="+"
          isGeneric
        />
      </div>
    </Section>
  )
}
