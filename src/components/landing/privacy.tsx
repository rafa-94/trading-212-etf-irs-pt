import { cn } from "@/lib/utils"
import { Section } from "@/components/landing/section"

interface PrivacyCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function PrivacyCard({ icon, title, description }: PrivacyCardProps) {
  return (
    <div className="bg-fis-card border border-fis-border rounded-xl p-8 text-left">
      <div className="w-11 h-11 rounded-lg bg-fis-accent/13 mb-5 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-serif text-base font-semibold text-fis-text mb-3">{title}</h3>
      <p className="text-sm text-fis-muted leading-relaxed">{description}</p>
    </div>
  )
}

interface PrivacySectionProps {
  className?: string
}

export function PrivacySection({ className }: PrivacySectionProps) {
  return (
    <Section id="privacidade" className={cn("border-t border-fis-border py-[100px]", className)} contentClassName="text-center" title="PRIVACIDADE TOTAL">
      <div className="font-mono text-[0.72rem] tracking-widest uppercase text-fis-accent mb-4"></div>
      <h2 className="font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-tight text-fis-text mb-6 max-w-[560px] mx-auto">
        Os seus dados nunca<br />saem do seu computador
      </h2>
      <p className="text-base text-fis-muted max-w-[520px] mx-auto mb-12 leading-relaxed">
        O Fiscus corre inteiramente no browser. Nenhum ficheiro é enviado para servidores. Nenhum dado é guardado. Feche a aba e tudo desaparece.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[860px] mx-auto">
        <PrivacyCard
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-fis-accent">
              <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 9V6.5a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          title="Sem servidor"
          description="Todo o processamento acontece localmente no seu browser. Os seus ficheiros nunca abandonam o seu dispositivo."
        />
        <PrivacyCard
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-fis-accent">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          title="Sem conta"
          description="Não precisa de criar conta, nem de fornecer email ou qualquer dado pessoal. Abre o browser e começa a usar."
        />
        <PrivacyCard
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-fis-accent">
              <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
          title="Sem rastreio"
          description="Sem cookies analíticos, sem telemetria, sem tracking. O que faz no Fiscus é exclusivamente seu."
        />
      </div>
    </Section>
  )
}
