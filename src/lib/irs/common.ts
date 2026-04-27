import type {
  RawTrade,
  RawDividend,
  IRSRow,
  DividendRow,
  HoldingReduction,
} from "../types"
import { getCountryCodeFromAlpha2, isFiscalParadise } from "./country"

const SUFFIX_ALPHA2_OVERRIDES: Record<string, string> = { UK: "GB" }

export function getCountryFromISIN(isin: string): string {
  if (!isin) return "372"
  const prefix = isin.substring(0, 2).toUpperCase()
  return getCountryCodeFromAlpha2(prefix) ?? "372"
}

export function getCountryFromTicker(ticker: string): string {
  if (!ticker) return "372"
  const dot = ticker.lastIndexOf(".")
  if (dot === -1) return "372"
  const suffix = ticker.substring(dot + 1).toUpperCase()
  const alpha2 = SUFFIX_ALPHA2_OVERRIDES[suffix] ?? suffix
  return getCountryCodeFromAlpha2(alpha2) ?? "372"
}

export function getDividendCode(isin: string, baseCode: string): string {
  if (!isin) return baseCode
  const alpha2 = isin.substring(0, 2).toUpperCase()
  return isFiscalParadise(alpha2) ? "E99" : baseCode
}

export function getCode(category: string, ticker = ""): string {
  if (category) {
    const cat = category.toUpperCase()
    if (cat === "STOCK") return "G01"
    if (cat === "ETF" || cat === "ETC") return "G20"
    if (cat === "CFD") return "G30"
  }
  const t = (ticker ?? "").toUpperCase()
  if (
    t.endsWith(".US") ||
    t.endsWith(".UK") ||
    t.endsWith(".DE") ||
    t.endsWith(".FR") ||
    t.endsWith(".IT") ||
    t.endsWith(".ES")
  )
    return "G20"
  if (!t.includes(".") && t.length <= 5) return "G01"
  return "G20"
}

export function fmtEur(n: number): string {
  return n.toFixed(2).replace(".", ",")
}

export function holdingReduction(days: number | null): HoldingReduction | null {
  if (days === null) return null
  if (days >= 8 * 365) return { pct: 30, rate: 19.6, label: "8+ anos" }
  if (days >= 5 * 365) return { pct: 20, rate: 22.4, label: "5-8 anos" }
  if (days >= 2 * 365) return { pct: 10, rate: 25.2, label: "2-5 anos" }
  return { pct: 0, rate: 28, label: "< 2 anos" }
}

export function buildIRSTable(
  trades: RawTrade[],
  year: number,
  codeMap?: Map<string, string>
): IRSRow[] {
  return trades
    .filter((t) => t.closeYear === year)
    .map((t, i) => {
      const days =
        t.holdingDays ??
        (t.openDate && t.closeDate
          ? Math.floor(
              (new Date(t.closeDate).getTime() -
                new Date(t.openDate).getTime()) /
                86400000
            )
          : null)
      const reduction = holdingReduction(days)
      const resolvedCode = t.isin ? codeMap?.get(t.isin) : undefined
      return {
        nr: i + 1,
        paisFonte: t.isin
          ? getCountryFromISIN(t.isin)
          : getCountryFromTicker(t.ticker),
        codigo: resolvedCode ?? getCode(t.category, t.ticker),
        closeYear: t.closeYear,
        closeMes: t.closeDate.split("-")[1] ?? "",
        closeDia: t.closeDate.split("-")[2] ?? "",
        realValue: t.saleValue,
        openYear: t.openDate.split("-")[0] ?? "",
        openMes: t.openDate.split("-")[1] ?? "",
        openDia: t.openDate.split("-")[2] ?? "",
        aqValue: t.purchaseValue,
        despesas:
          Math.round(((t.buyCharges ?? 0) + (t.sellCharges ?? 0)) * 100) / 100,
        imposto: 0,
        contraparte: "620",
        instrument: t.instrument,
        ticker: t.ticker,
        pnl: t.saleValue - t.purchaseValue,
        source: t.source,
        anexo: t.anexo ?? "J",
        holdingDays: days,
        reduction,
        missingBuy: t.missingBuy ?? false,
      }
    })
}

export function buildDividendTable(
  dividends: RawDividend[],
  year: number
): DividendRow[] {
  const filtered = dividends.filter((d) => d.year === year)
  const groups: Record<
    string,
    {
      codigoRendimento: string
      country: string
      grossEur: number
      withholdingEur: number
      source: RawDividend["source"]
      tickers: Set<string>
    }
  > = {}

  for (const d of filtered) {
    const key = `${d.codigoRendimento}|${d.country}`
    if (!groups[key]) {
      groups[key] = {
        codigoRendimento: d.codigoRendimento,
        country: d.country,
        grossEur: 0,
        withholdingEur: 0,
        source: d.source,
        tickers: new Set(),
      }
    }
    groups[key].grossEur += d.grossEur
    groups[key].withholdingEur += d.withholdingEur
    groups[key].tickers.add(d.ticker)
  }

  return Object.values(groups).map((g, i) => ({
    nr: 801 + i,
    codigoRendimento: g.codigoRendimento,
    country: g.country,
    grossEur: Math.round(g.grossEur * 100) / 100,
    withholdingEur: Math.round(g.withholdingEur * 100) / 100,
    source: g.source,
    tickers: [...g.tickers].join(", "),
  }))
}
