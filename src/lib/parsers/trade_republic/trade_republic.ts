import type { RawTrade, RawDividend } from "../../types"
import { parseCSVLine, parseNum } from "../helpers"
import { getCountryFromISIN, getDividendCode } from "../../irs/common"

interface BuyLot {
  ticker: string
  instrument: string
  isin: string
  category: string
  date: string
  shares: number
  cost: number
  fee: number
  remaining: number
}

export function parseTR(text: string): RawTrade[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const buyLots: BuyLot[] = []
  const sellLots: Array<{
    ticker: string
    instrument: string
    isin: string
    category: string
    date: string
    shares: number
    proceeds: number
    fee: number
  }> = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 10) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    if (row.category !== "TRADING") continue
    const isBuy = row.type === "BUY"
    const isSell = row.type === "SELL"
    if (!isBuy && !isSell) continue

    const isin = row.symbol ?? ""
    const name = row.name || isin
    const date = row.date ?? ""
    const shares = Math.abs(parseNum(row.shares))
    const price = parseNum(row.price)
    const amount = Math.abs(parseNum(row.amount))
    const category = row.asset_class === "STOCK" ? "STOCK" : "ETF"

    if (!isin || !date || shares < 0.000001) continue

    const fee = Math.abs(parseNum(row.fee))
    const cost = amount > 0 ? amount : shares * price
    if (isBuy) {
      buyLots.push({
        ticker: isin,
        instrument: name,
        isin,
        category,
        date,
        shares,
        cost,
        fee,
        remaining: shares,
      })
    } else {
      const proceeds = amount > 0 ? amount : shares * price
      sellLots.push({
        ticker: isin,
        instrument: name,
        isin,
        category,
        date,
        shares,
        proceeds,
        fee,
      })
    }
  }

  if (sellLots.length === 0) return []

  const buyQueues: Record<string, BuyLot[]> = {}
  for (const lot of buyLots) {
    if (!buyQueues[lot.ticker]) buyQueues[lot.ticker] = []
    buyQueues[lot.ticker].push({ ...lot })
  }
  for (const q of Object.values(buyQueues)) {
    q.sort((a, b) => a.date.localeCompare(b.date))
  }

  const result: RawTrade[] = []
  const TOL = 0.0002

  for (const sell of sellLots) {
    const closeDate = sell.date
    const closeYear = parseInt(closeDate.substring(0, 4))
    if (isNaN(closeYear)) continue

    const queue = buyQueues[sell.ticker] ?? []
    let remaining = sell.shares
    const sellPpu = sell.proceeds / sell.shares

    while (remaining > TOL && queue.length > 0) {
      const buy = queue[0]
      if (buy.remaining < 0.000001) {
        queue.shift()
        continue
      }

      const fill = Math.min(buy.remaining, remaining)
      const aqValue = fill * (buy.cost / buy.shares)
      const saleValue = fill * sellPpu
      const holdingDays = Math.floor(
        (new Date(closeDate).getTime() - new Date(buy.date).getTime()) /
          86400000
      )
      const buyCharges = Math.round(buy.fee * (fill / buy.shares) * 100) / 100
      const sellCharges =
        Math.round(sell.fee * (fill / sell.shares) * 100) / 100

      result.push({
        instrument: sell.instrument || buy.instrument,
        category: sell.category || buy.category,
        ticker: sell.ticker,
        isin: sell.isin || buy.isin,
        openDate: buy.date,
        closeDate,
        purchaseValue: Math.round(aqValue * 100) / 100,
        saleValue: Math.round(saleValue * 100) / 100,
        pnl: Math.round((saleValue - aqValue) * 100) / 100,
        closeYear,
        source: "TRADE_REPUBLIC",
        anexo: "J",
        holdingDays,
        ...(buyCharges > 0 && { buyCharges }),
        ...(sellCharges > 0 && { sellCharges }),
      })

      buy.remaining -= fill
      remaining -= fill
      if (buy.remaining < TOL) queue.shift()
    }

    if (remaining > TOL) {
      const sellCharges =
        Math.round(sell.fee * (remaining / sell.shares) * 100) / 100
      result.push({
        instrument: sell.instrument,
        category: sell.category,
        ticker: sell.ticker,
        isin: sell.isin,
        openDate: "",
        closeDate,
        purchaseValue: 0,
        saleValue: Math.round(sell.proceeds * 100) / 100,
        pnl: Math.round(sell.proceeds * 100) / 100,
        closeYear,
        source: "TRADE_REPUBLIC",
        anexo: "J",
        holdingDays: null,
        missingBuy: true,
        ...(sellCharges > 0 && { sellCharges }),
      })
    }
  }
  return result
}

export function extractTRDividends(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const results: RawDividend[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 10) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    if (row.type !== "DIVIDEND") continue

    const isin = row.symbol ?? ""
    const name = row.name || isin
    const date = row.date ?? ""
    const year = parseInt((date ?? "").substring(0, 4))
    const grossEur = Math.abs(parseNum(row.amount))
    const withholdingEur = Math.abs(parseNum(row.tax))

    if (!date || isNaN(year) || grossEur === 0) continue

    results.push({
      ticker: isin,
      instrument: name,
      isin,
      country: getCountryFromISIN(isin),
      date,
      year,
      grossEur: Math.round(grossEur * 100) / 100,
      withholdingEur: Math.round(withholdingEur * 100) / 100,
      source: "TRADE_REPUBLIC",
      codigoRendimento: getDividendCode(isin, "E11"),
    })
  }
  return results
}

export function extractTRInterest(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const results: RawDividend[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 11) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    if (row.type !== "INTEREST_PAYMENT") continue

    const date = row.date ?? ""
    const year = parseInt((date ?? "").substring(0, 4))
    const amount = parseNum(row.amount)

    if (!date || isNaN(year) || amount <= 0) continue

    results.push({
      ticker: "TR_INT",
      instrument: "Juros · Trade Republic",
      isin: "",
      country: "276",
      date,
      year,
      grossEur: Math.round(amount * 100) / 100,
      withholdingEur: 0,
      source: "TRADE_REPUBLIC",
      codigoRendimento: "E21",
    })
  }
  return results
}
