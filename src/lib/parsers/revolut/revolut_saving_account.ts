import type { RawDividend } from "../../types"
import { parseCSVLine } from "../helpers"

function parseDate(s: string): string {
  if (!s) return ""
  const parts = s.trim().split("/")
  if (parts.length !== 3) return ""
  const [d, m, y] = parts
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
}

function parseAmount(s: string): number {
  if (!s) return 0
  const clean = s.replace(/€/g, "").replace(/\s/g, "").replace(",", ".")
  return parseFloat(clean) || 0
}

export function extractRevolutSavingInterest(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  const results: RawDividend[] = []

  for (const line of lines) {
    const cols = parseCSVLine(line)
    if (cols.length < 5) continue

    const dateStr = cols[0] ?? ""
    const descricao = cols[2] ?? ""
    const entrada = cols[4] ?? ""

    if (!dateStr.includes("/")) continue
    if (!descricao.toLowerCase().includes("pagamento de juros")) continue

    const date = parseDate(dateStr)
    const year = parseInt(date.substring(0, 4))
    const amount = parseAmount(entrada)

    if (!date || isNaN(year) || amount <= 0) continue

    results.push({
      ticker: "REVOLUT_SAV",
      instrument: "Juros · Revolut Conta Reforçada",
      isin: "",
      country: "440",
      date,
      year,
      grossEur: Math.round(amount * 10000) / 10000,
      withholdingEur: 0,
      source: "REVOLUT_SAVING",
      codigoRendimento: "E21",
    })
  }
  return results
}
