import type { RawDividend } from "../../types"
import { parseCSVLine, parseNum } from "../helpers"

function parseDate(s: string): string {
  if (!s) return ""
  const datePart = s.split(",")[0].trim()
  const parts = datePart.split("/")
  if (parts.length !== 3) return ""
  const [d, m, y] = parts
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
}

export function extractRevolutFlexInterest(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const byDate: Record<string, { interest: number; fee: number }> = {}

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 3) continue

    const dateStr = cols[0] ?? ""
    const description = cols[1] ?? ""
    const valueStr = cols[2] ?? ""

    const isInterestPaid = description.includes("Interest PAID")
    const isServiceFee = description.includes("Service Fee Charged")
    if (!isInterestPaid && !isServiceFee) continue

    const date = parseDate(dateStr)
    if (!date) continue

    if (!byDate[date]) byDate[date] = { interest: 0, fee: 0 }
    const amount = parseNum(valueStr)
    if (isInterestPaid) byDate[date].interest += amount
    if (isServiceFee) byDate[date].fee += Math.abs(amount)
  }

  return Object.entries(byDate).flatMap(([date, { interest, fee }]) => {
    const net = Math.round((interest - fee) * 10000) / 10000
    const year = parseInt(date.substring(0, 4))
    if (net <= 0 || isNaN(year)) return []
    return [
      {
        ticker: "REVOLUT_FLEX",
        instrument: "Juros · Revolut Flexible Cash Fund",
        isin: "IE000AZVL3K0",
        country: "440",
        date,
        year,
        grossEur: net,
        withholdingEur: 0,
        source: "REVOLUT_FLEX" as const,
        codigoRendimento: "E21",
      },
    ]
  })
}
