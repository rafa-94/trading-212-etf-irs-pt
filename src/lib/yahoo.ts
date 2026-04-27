import type { RawTrade } from "./types"

const cache = new Map<string, string>()

async function fetchQuoteType(isin: string): Promise<string> {
  if (cache.has(isin)) return cache.get(isin)!
  try {
    const res = await fetch(`/api/yahoo?q=${encodeURIComponent(isin)}`)
    const data = await res.json()
    const quoteType: string = data?.quoteType ?? ""
    cache.set(isin, quoteType)
    return quoteType
  } catch {
    cache.set(isin, "")
    return ""
  }
}

function quoteTypeToCode(quoteType: string): string | null {
  const qt = quoteType.toUpperCase()
  if (qt === "ETF" || qt === "MUTUALFUND") return "G20"
  if (qt === "EQUITY") return "G01"
  return null
}

export async function resolveCodeMap(
  trades: RawTrade[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  const isins = [
    ...new Set(
      trades
        .filter((t) => t.isin && t.category?.toUpperCase() !== "CFD")
        .map((t) => t.isin!)
    ),
  ]
  await Promise.all(
    isins.map(async (isin) => {
      const quoteType = await fetchQuoteType(isin)
      const code = quoteTypeToCode(quoteType)
      if (code) map.set(isin, code)
    })
  )
  return map
}
