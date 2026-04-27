import { Section } from "@/components/landing/section"

export function XmlCodeBlock() {
  return (
    <div className="bg-fis-bg border border-fis-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-fis-border font-mono text-[0.72rem] text-fis-faint flex items-center gap-2">
        <span className="w-3 h-3 rounded text-[8px] font-bold text-fis-gold bg-fis-gold/13 flex items-center justify-center">XML</span>
        modelo3_2024_preenchido.xml
      </div>
      <div className="p-5 font-mono text-[0.72rem] leading-[1.9] overflow-x-auto whitespace-pre">
        <div><span className="text-fis-faint">&lt;!-- Gerado pelo Fiscus --&gt;</span></div>
        <div><span className="text-fis-accent">&lt;AnexoJ&gt;</span></div>
        <div>{"  "}<span className="text-fis-accent">&lt;Quadro09&gt;</span></div>
        <div>{"    "}<span className="text-fis-accent">&lt;Linha</span>{" "}<span className="text-fis-gold">Codigo</span>=<span className="text-fis-blue">&quot;601&quot;</span><span className="text-fis-accent">&gt;</span></div>
        <div>{"      "}<span className="text-fis-accent">&lt;Pais&gt;</span><span className="text-fis-blue">IE</span><span className="text-fis-accent">&lt;/Pais&gt;</span></div>
        <div>{"      "}<span className="text-fis-accent">&lt;Rendimento&gt;</span><span className="text-fis-blue">648.90</span><span className="text-fis-accent">&lt;/Rendimento&gt;</span></div>
        <div>{"      "}<span className="text-fis-accent">&lt;ImpRetido&gt;</span><span className="text-fis-blue">97.34</span><span className="text-fis-accent">&lt;/ImpRetido&gt;</span></div>
        <div>{"    "}<span className="text-fis-accent">&lt;/Linha&gt;</span></div>
        <div>{"  "}<span className="text-fis-accent">&lt;/Quadro09&gt;</span></div>
        <div><span className="text-fis-accent">&lt;/AnexoJ&gt;</span></div>
      </div>
      <div className="px-5 py-3 border-t border-fis-border flex gap-2 flex-wrap">
        <span className="font-mono text-[0.65rem] px-2 py-1 rounded bg-fis-gold/13 border border-fis-gold text-fis-gold">Anexo J</span>
        <span className="font-mono text-[0.65rem] px-2 py-1 rounded bg-fis-gold/13 border border-fis-gold text-fis-gold">Anexo E</span>
        <span className="font-mono text-[0.65rem] px-2 py-1 rounded bg-fis-gold/13 border border-fis-gold text-fis-gold">Anexo G</span>
        <span className="font-mono text-[0.65rem] px-2 py-1 rounded bg-fis-gold/13 border border-fis-gold text-fis-gold">Quadro 9</span>
        <span className="font-mono text-[0.65rem] px-2 py-1 rounded bg-fis-gold/13 border border-fis-gold text-fis-gold">Quadro 5</span>
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
      <div className="bg-gradient-to-br from-fis-surface to-fis-card border border-fis-border rounded-3xl p-16 max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fis-gold/13 border border-fis-gold font-mono text-[0.68rem] text-fis-gold mb-4">
              <span>✦ INTEGRAÇÃO AT</span>
            </div>
            <h2 className="font-serif text-2xl font-bold leading-[1.15] tracking-tight text-fis-text mb-4">
              Importa o XML da AT.<br />Preenche os anexos.
            </h2>
            <p className="text-fis-muted text-sm leading-relaxed mb-6">
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
                <li key={item} className="flex items-start gap-3 text-sm text-fis-muted">
                  <div className="w-1.5 h-1.5 rounded-full bg-fis-gold mt-2 flex-shrink-0" />
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
