import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"

interface BrokerCardProps {
  name: string
  format: string
  initials: string
  colorClass: string
  isGeneric?: boolean
}

export function BrokerCard({ name, format, initials, colorClass, isGeneric }: BrokerCardProps) {
  return (
    <div className={cn("bg-fis-card border border-fis-border rounded-lg p-5 text-center transition-colors hover:border-fis-border-light", isGeneric && "border-dashed")}>
      <div
        className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center font-bold text-xs font-mono"
        style={{ backgroundColor: `${colorClass}1a`, color: colorClass }}
      >
        {initials}
      </div>
      <div className="font-medium text-sm text-fis-text mb-1">{name}</div>
      <div className="font-mono text-[0.65rem] text-fis-faint">{format}</div>
    </div>
  )
}

interface BrokersSectionProps {
  className?: string
}

export function BrokersSection({ className }: BrokersSectionProps) {
  const brokers = [
    { name: "Interactive Brokers", format: "CSV · FLEX", initials: "IB", color: "#ff5050" },
    { name: "DEGIRO", format: "CSV", initials: "DE", color: "#00b478" },
    { name: "Trading 212", format: "CSV", initials: "T2", color: "#64a0ff" },
    { name: "Revolut", format: "CSV · PDF", initials: "RV", color: "#ffa000" },
    { name: "eToro", format: "XLSX", initials: "ET", color: "#50c878" },
    { name: "XTB", format: "CSV", initials: "XS", color: "#b464ff" },
    { name: "Saxo Bank", format: "CSV · XLS", initials: "SX", color: "#ff7800" },
    { name: "Coinbase", format: "CSV", initials: "CB", color: "#0096c8" },
    { name: "Binance", format: "CSV", initials: "BN", color: "#f0b90b" },
  ]

  return (
    <Section id="brokers" className={cn("border-t border-fis-border", className)} title="Brokers Suportados">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <h2 className="font-serif text-[1.8rem] font-bold tracking-tight text-fis-text">
            Compatível com os principais<br />brokers usados em Portugal
          </h2>
        <p className="text-fis-muted text-sm max-w-[280px] text-right leading-relaxed">
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
            colorClass={broker.color}
          />
        ))}
        <BrokerCard
          name="Outro broker"
          format="CSV Genérico"
          initials="+"
          colorClass="#0ddfaa"
          isGeneric
        />
      </div>
    </Section>
  )
}
