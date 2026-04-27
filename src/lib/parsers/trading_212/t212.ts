import type { RawTrade, RawDividend } from "../../types"
import { parseCSVLine, parseNum, fmtDate, findCol } from "../helpers"
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

interface SellLot {
  ticker: string
  instrument: string
  isin: string
  category: string
  date: string
  shares: number
  proceeds: number
  fee: number
  isMain: boolean
}

export function parseT212(text: string): RawTrade[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) throw new Error("Ficheiro Trading 212 vazio")

  const headers = parseCSVLine(lines[0])
  const allRows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 3) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })
    allRows.push(row)
  }
  if (allRows.length === 0) throw new Error("Sem dados no ficheiro Trading 212")

  const buyLots: BuyLot[] = []
  const sellLots: SellLot[] = []

  for (const row of allRows) {
    const action = findCol(row, ["Action", "Type"]).toLowerCase()
    if (!action) continue
    const isBuy = action.includes("buy")
    const isSell = action.includes("sell")
    if (!isBuy && !isSell) continue

    const isin = findCol(row, ["ISIN"])
    const ticker = findCol(row, ["Ticker", "Symbol"]) || isin
    const instrument =
      findCol(row, ["Name", "Instrument", "Security"]) || ticker
    const dateStr = findCol(row, ["Time", "Date", "Datetime"])
    const date = fmtDate((dateStr ?? "").split(" ")[0])
    const shares = Math.abs(
      parseNum(findCol(row, ["No. of shares", "Shares", "Quantity", "Units"]))
    )
    const price = parseNum(
      findCol(row, [
        "Price / share",
        "Price/share",
        "Price per share",
        "Share price",
      ])
    )
    const totalRaw = findCol(row, ["Total"])
    const total = Math.abs(parseNum(totalRaw))
    const hasPrice = price > 0

    const isinPrefix = (isin ?? "").substring(0, 2).toUpperCase()
    const category =
      isinPrefix === "IE" || isinPrefix === "LU" ? "ETF" : "STOCK"

    if (!ticker || !date || shares < 0.000001) continue

    const fee = Math.abs(
      parseNum(
        findCol(row, [
          "Currency conversion fee",
          "Currency Conversion Fee",
          "Fee",
        ])
      )
    )

    if (isBuy) {
      const cost = total > 0 ? total : shares * price
      buyLots.push({
        ticker,
        instrument,
        isin,
        category,
        date,
        shares,
        cost,
        fee,
        remaining: shares,
      })
    } else {
      const proceeds = total > 0 ? total : shares * price
      sellLots.push({
        ticker,
        instrument,
        isin,
        category,
        date,
        shares,
        proceeds,
        fee,
        isMain: hasPrice,
      })
    }
  }

  if (sellLots.length === 0)
    throw new Error(
      "Nenhuma venda encontrada. Exporta o histórico completo de ordens da Trading 212."
    )

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
    if (sell.isMain) {
      const hasSub = sellLots.some(
        (s) => !s.isMain && s.ticker === sell.ticker && s.date === sell.date
      )
      if (hasSub) continue
    }

    const closeDate = sell.date
    const closeYear = parseInt(closeDate.substring(0, 4))
    if (isNaN(closeYear) || closeYear < 2020) continue

    const queue = buyQueues[sell.ticker] ?? []
    let matched = false

    for (let i = 0; i < queue.length; i++) {
      const buy = queue[i]
      if (buy.remaining < 0.000001) continue
      if (Math.abs(buy.remaining - sell.shares) < TOL) {
        const aqValue = buy.cost * (sell.shares / buy.shares)
        const holdingDays =
          buy.date && closeDate
            ? Math.floor(
                (new Date(closeDate).getTime() - new Date(buy.date).getTime()) /
                  86400000
              )
            : null
        const buyCharges =
          Math.round(buy.fee * (sell.shares / buy.shares) * 100) / 100
        result.push({
          instrument: sell.instrument || buy.instrument,
          category: sell.category || buy.category || "ETF",
          ticker: sell.ticker,
          isin: sell.isin || buy.isin,
          openDate: buy.date,
          closeDate,
          purchaseValue: Math.round(aqValue * 100) / 100,
          saleValue: Math.round(sell.proceeds * 100) / 100,
          pnl: Math.round((sell.proceeds - aqValue) * 100) / 100,
          closeYear,
          source: "T212",
          anexo: "J",
          holdingDays,
          ...(buyCharges > 0 && { buyCharges }),
          ...(sell.fee > 0 && { sellCharges: sell.fee }),
        })
        buy.remaining = 0
        matched = true
        break
      }
    }

    if (!matched) {
      let remainingToSell = sell.shares
      const sellPpu = sell.proceeds / sell.shares

      while (remainingToSell > TOL && queue.length > 0) {
        const buy = queue[0]
        if (buy.remaining < 0.000001) {
          queue.shift()
          continue
        }

        const fill = Math.min(buy.remaining, remainingToSell)
        const buyPpu = buy.cost / buy.shares
        const aqValue = fill * buyPpu
        const saleValue = fill * sellPpu
        const holdingDays =
          buy.date && closeDate
            ? Math.floor(
                (new Date(closeDate).getTime() - new Date(buy.date).getTime()) /
                  86400000
              )
            : null
        const buyCharges = Math.round(buy.fee * (fill / buy.shares) * 100) / 100
        const sellCharges =
          Math.round(sell.fee * (fill / sell.shares) * 100) / 100

        result.push({
          instrument: sell.instrument || buy.instrument,
          category: sell.category || buy.category || "ETF",
          ticker: sell.ticker,
          isin: sell.isin || buy.isin,
          openDate: buy.date,
          closeDate,
          purchaseValue: Math.round(aqValue * 100) / 100,
          saleValue: Math.round(saleValue * 100) / 100,
          pnl: Math.round((saleValue - aqValue) * 100) / 100,
          closeYear,
          source: "T212",
          anexo: "J",
          holdingDays,
          ...(buyCharges > 0 && { buyCharges }),
          ...(sellCharges > 0 && { sellCharges }),
        })

        buy.remaining -= fill
        remainingToSell -= fill
        if (buy.remaining < TOL) queue.shift()
      }

      if (remainingToSell > TOL) {
        const sellCharges =
          Math.round(sell.fee * (remainingToSell / sell.shares) * 100) / 100
        result.push({
          instrument: sell.instrument,
          category: sell.category || "ETF",
          ticker: sell.ticker,
          isin: sell.isin,
          openDate: "",
          closeDate,
          purchaseValue: 0,
          saleValue: Math.round(sell.proceeds * 100) / 100,
          pnl: Math.round(sell.proceeds * 100) / 100,
          closeYear,
          source: "T212",
          anexo: "J",
          holdingDays: null,
          missingBuy: true,
          ...(sellCharges > 0 && { sellCharges }),
        })
      }
    }
  }

  if (result.length === 0)
    throw new Error(
      "Não foi possível processar as transações. Verifica se o ficheiro contém compras e vendas."
    )

  return result
}

export function extractT212Interest(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const results: RawDividend[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 3) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    const action = findCol(row, ["Action", "Type"]).toLowerCase()
    if (!action.includes("interest")) continue

    const dateStr = findCol(row, ["Time", "Date", "Datetime"])
    const date = fmtDate((dateStr ?? "").split(" ")[0])
    const year = parseInt((date ?? "").substring(0, 4))
    const grossEur = Math.abs(parseNum(findCol(row, ["Total"])))

    if (!date || isNaN(year) || grossEur === 0) continue

    results.push({
      ticker: "T212_INT",
      instrument: "Juros · Trading 212",
      isin: "",
      country: "196",
      date,
      year,
      grossEur: Math.round(grossEur * 100) / 100,
      withholdingEur: 0,
      source: "T212",
      codigoRendimento: "E21",
    })
  }
  return results
}

export function extractT212Dividends(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const dividends: RawDividend[] = []

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 3) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    const action = findCol(row, ["Action", "Type"]).toLowerCase()
    if (!action.includes("dividend")) continue

    const isin = findCol(row, ["ISIN"])
    const ticker = findCol(row, ["Ticker", "Symbol"]) || isin
    const instrument =
      findCol(row, ["Name", "Instrument", "Security"]) || ticker
    const dateStr = findCol(row, ["Time", "Date", "Datetime"])
    const date = fmtDate((dateStr ?? "").split(" ")[0])
    const year = parseInt((date ?? "").substring(0, 4))
    const grossEur = Math.abs(parseNum(findCol(row, ["Total"])))
    const withholdingEur = Math.abs(
      parseNum(findCol(row, ["Withholding tax", "Withholding"]))
    )

    if (!ticker || !date || grossEur === 0) continue

    const country = getCountryFromISIN(isin)

    dividends.push({
      ticker,
      instrument,
      isin,
      country,
      date,
      year,
      grossEur,
      withholdingEur,
      source: "T212",
      codigoRendimento: getDividendCode(isin, "E11"),
    })
  }
  return dividends
}
