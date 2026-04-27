import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/landing/section"
import { ArrowRight } from "lucide-react"


interface HeroProps {
  className?: string
}

export async function Hero({ className }: HeroProps) {
  const t = await getTranslations('landing.hero.trust');

  return (
    <Section className={cn("pt-36 pb-24", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 font-mono text-[0.72rem] text-primary w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span>DECLARAÇÃO IRS 2024 · Modelo 3</span>
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,4.5vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-foreground">
            O seu IRS declarado com <span className="text-primary italic">precisão cirúrgica</span>
          </h1>

          <p className="text-[1.05rem] text-muted-foreground leading-[1.75] max-w-[480px]">
            Carregue o CSV ou Excel do seu broker. O Fiscus calcula automaticamente os ganhos e perdas de ações, ETFs, dividendos, juros e criptomoedas — e preenche os anexos da AT.
          </p>

          <div className="flex flex-wrap items-center gap-4">
              <a href="/app" className={cn(buttonVariants({ variant: "default", size: "2xl" }), "font-bold hover:-translate-y-0.5 hover:shadow-[0_8px_32px_color-mix(in_oklch,var(--primary)_30%,transparent)]")}>
                <ArrowRight />
                Abrir o Fiscus
              </a>
              <a href="#como-funciona" className={cn(buttonVariants({ variant: "outline", size: "2xl" }), "font-bold hover:border-primary! hover:text-primary! hover:bg-background!")}>Como funciona</a>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {[
              {
                key: "browser",
                label: t("browser"),
                icon: (
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <path d="M7 1L8.8 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.2L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                key: "privacy",
                label: t("privacy"),
                icon: (
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                key: "fifo",
                label: t("fifo"),
                icon: (
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <path d="M2 7.5L5.5 11 12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                key: "free",
                label: t("free"),
                icon: (
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <path d="M7 1v6l3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <div className="text-primary">{item.icon}</div>
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="ring-1 ring-border bg-secondary rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <div className="flex gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]"></div>
              </div>
              <span className="font-mono text-xs text-muted-foreground ml-1">fiscus — processamento de trades</span>
            </div>

            <div className="m-6 border-2 border-border rounded-xl p-8 text-center border-dashed">
              <div className="w-11 h-11 rounded-lg bg-primary/10 mx-auto mb-4 flex items-center justify-center text-primary">
                <svg viewBox="0 0 22 22" fill="none" className="w-5 h-5">
                  <path d="M4 11h14M11 4l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-medium text-foreground mb-2">Resultados calculados</p>
              <p className="font-mono text-[0.72rem] text-primary">Ações · ETFs · Dividendos · Crypto</p>
            </div>

            <div className="grid grid-cols-2 gap-2 m-6">
              <ResultCard label="Mais-Valias" value="+€2.847,32" type="positive" sub="18 operações · ETFs/Ações" />
              <ResultCard label="Menos-Valias" value="-€391,15" type="negative" sub="5 operações · Ações" />
              <ResultCard label="Dividendos" value="€648,90" type="gold" sub="Ret. na fonte · 12 eventos" />
              <ResultCard label="Crypto (FIFO)" value="+€1.123,40" type="positive" sub="BTC · ETH · 24 trades" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function ResultCard({ label, value, type, sub }: { label: string; value: string; type: "positive" | "negative" | "gold"; sub: string }) {
  const colorClass =
    type === "positive" ? "text-primary" : type === "negative" ? "text-destructive" : "text-gold"

  return (
    <div className="bg-card border border-border rounded-lg p-3.5">
      <div className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
      <div className={cn("font-mono text-lg font-semibold", colorClass)}>{value}</div>
      <div className="text-[0.7rem] text-muted-foreground mt-1">{sub}</div>
    </div>
  )
}
