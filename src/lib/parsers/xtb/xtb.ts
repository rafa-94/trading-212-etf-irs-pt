import type { RawTrade, RawDividend } from "../../types"
import { parseCSVLine, parseNum, fmtDate, findCol } from "../helpers"
import { getCountryFromTicker } from "../../irs/common"

export function parseXTB(text: string): RawTrade[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  let headerIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("Instrument,")) {
      headerIdx = i
      break
    }
  }
  if (headerIdx === -1) throw new Error("Formato XTB não reconhecido")

  const headers = parseCSVLine(lines[headerIdx])
  const rows: RawTrade[] = []

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 14) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = cols[idx] ?? ""
    })
    if (!row["Open Time (UTC)"] || row["Instrument"] === "Profit/loss") continue

    const closeYear = parseInt((row["Close Time (UTC)"] ?? "").substring(0, 4))
    if (isNaN(closeYear) || closeYear < 2020) continue

    const commission = Math.abs(parseNum(row["Commission"] ?? ""))
    rows.push({
      instrument: row["Instrument"] ?? "",
      category: row["Category"] ?? "",
      ticker: row["Ticker"] ?? "",
      openDate: fmtDate(row["Open Time (UTC)"]),
      closeDate: fmtDate(row["Close Time (UTC)"]),
      purchaseValue: parseNum(row["Purchase Value"]),
      saleValue: parseNum(row["Sale Value"]),
      pnl: parseNum(row["Profit/Loss"]),
      closeYear,
      source: "XTB",
      anexo: "G",
      ...(commission > 0 && { buyCharges: commission }),
    })
  }
  return rows
}

export function extractXTBInterest(text: string): RawDividend[] {
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

    const type = (
      findCol(row, ["Type", "Operation", "Category"]) ?? ""
    ).toLowerCase()
    if (!type.includes("interest")) continue

    const dateStr = findCol(row, ["Time", "Date", "Datetime"])
    const date = fmtDate((dateStr ?? "").split(" ")[0])
    const year = parseInt((date ?? "").substring(0, 4))
    const grossEur = Math.abs(
      parseNum(findCol(row, ["Amount", "Value", "Net"]))
    )

    if (!date || isNaN(year) || grossEur === 0) continue

    results.push({
      ticker: "XTB_INT",
      instrument: "Juros · XTB",
      isin: "",
      country: "620",
      date,
      year,
      grossEur: Math.round(grossEur * 100) / 100,
      withholdingEur: 0,
      source: "XTB",
      codigoRendimento: "E20",
    })
  }
  return results
}

export function extractXTBDividends(text: string): RawDividend[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const dividends: RawDividend[] = []
  const taxMap: Record<string, number> = {}

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    const type = (
      findCol(row, ["Type", "Operation", "Category"]) ?? ""
    ).toLowerCase()
    if (!type.includes("tax") && !type.includes("withholding")) continue

    const dateStr = findCol(row, ["Time", "Date", "Datetime"])
    const date = fmtDate((dateStr ?? "").split(" ")[0])
    const comment = findCol(row, ["Comment", "Description", "Symbol"])
    const amount = Math.abs(parseNum(findCol(row, ["Amount", "Value", "Net"])))
    const key = date + "|" + comment
    taxMap[key] = (taxMap[key] ?? 0) + amount
  }

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 3) continue
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (cols[idx] ?? "").trim()
    })

    const type = (
      findCol(row, ["Type", "Operation", "Category"]) ?? ""
    ).toLowerCase()
    if (!type.includes("dividend")) continue

    const dateStr = findCol(row, ["Time", "Date", "Datetime"])
    const date = fmtDate((dateStr ?? "").split(" ")[0])
    const year = parseInt((date ?? "").substring(0, 4))
    const ticker = findCol(row, ["Symbol", "Ticker", "Comment"])
    const instrument = findCol(row, ["Name", "Instrument"]) || ticker
    const grossEur = Math.abs(
      parseNum(findCol(row, ["Amount", "Value", "Net"]))
    )

    if (!date || grossEur === 0) continue

    const key = date + "|" + ticker
    const withholdingEur = taxMap[key] ?? 0

    dividends.push({
      ticker: ticker || "?",
      instrument,
      isin: "",
      country: getCountryFromTicker(ticker ?? ""),
      date,
      year,
      grossEur,
      withholdingEur,
      source: "XTB",
      codigoRendimento: "E10",
    })
  }
  return dividends
}
