import { Section } from "@/components/landing/section"

export function XmlCodeBlock() {
  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border font-mono text-[0.72rem] text-muted-foreground flex items-center gap-2">
        <span className="w-6 h-4 rounded text-[8px] font-bold text-gold bg-gold/10 flex items-center justify-center">XML</span>
        modelo3_2024_preenchido.xml
      </div>
      <div className="p-5 font-mono text-[0.72rem] leading-[1.9] overflow-x-auto whitespace-pre">
        <div><span className="text-muted-foreground/60">&lt;!-- Gerado pelo Fiscus --&gt;</span></div>
        <div><span className="text-primary">&lt;AnexoJ&gt;</span></div>
        <div>{"  "}<span className="text-primary">&lt;Quadro09&gt;</span></div>
        <div>{"    "}<span className="text-primary">&lt;Linha</span>{" "}<span className="text-gold">Codigo</span>=<span className="text-blue-400">&quot;601&quot;</span><span className="text-primary">&gt;</span></div>
        <div>{"      "}<span className="text-primary">&lt;Pais&gt;</span><span className="text-blue-400">IE</span><span className="text-primary">&lt;/Pais&gt;</span></div>
        <div>{"      "}<span className="text-primary">&lt;Rendimento&gt;</span><span className="text-blue-400">648.90</span><span className="text-primary">&lt;/Rendimento&gt;</span></div>
        <div>{"      "}<span className="text-primary">&lt;ImpRetido&gt;</span><span className="text-blue-400">97.34</span><span className="text-primary">&lt;/ImpRetido&gt;</span></div>
        <div>{"    "}<span className="text-primary">&lt;/Linha&gt;</span></div>
        <div>{"  "}<span className="text-primary">&lt;/Quadro09&gt;</span></div>
        <div><span className="text-primary">&lt;/AnexoJ&gt;</span></div>
      </div>
      <div className="px-5 py-3 border-t border-border flex gap-2 flex-wrap">
        {["Anexo J", "Anexo E", "Anexo G", "Quadro 9", "Quadro 5"].map((label) => (
          <span key={label} className="font-mono text-[0.65rem] px-2 py-1 rounded bg-gold/10 border border-gold text-gold">
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

interface XmlSectionProps {
  className?: string
}

export function XmlSection({ className }: XmlSectionProps) {
  return (
    <Section className={className}>
      <div className="bg-card border border-border rounded-3xl p-16 max-w-290 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold font-mono text-[0.68rem] text-gold mb-4">
              <span>✦ INTEGRAÇÃO AT</span>
            </div>
            <h2 className="font-serif text-2xl font-bold leading-[1.15] tracking-tight text-foreground mb-4">
              Importa o XML da AT.<br />Preenche os anexos.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Importe o ficheiro XML que descarregou do Portal das Finanças. O Fiscus preenche automaticamente todas as tabelas e quadros dos anexos — sem copiar e colar valores um a um.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Quadro 9 do Anexo J — rendimentos de valores mobiliários no estrangeiro",
                "Quadro 5 do Anexo E — dividendos, juros e outros rendimentos de capitais",
                "Quadro 9 do Anexo G — mais e menos-valias de alienação de valores",
                "Validação automática de NIF, IBAN e campos obrigatórios",
                "Export do XML validado pronto a submeter na declaração",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <XmlCodeBlock />
          </div>
        </div>
      </div>
    </Section>
  )
}
