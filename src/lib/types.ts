export type BrokerSource =
  | "XTB"
  | "T212"
  | "TRADE_REPUBLIC"
  | "REVOLUT_SAVING"
  | "REVOLUT_FLEX"

export type Anexo = "G" | "J"

export interface HoldingReduction {
  pct: number
  rate: number
  label: string
}

export interface RawTrade {
  instrument: string
  category: string
  ticker: string
  isin?: string
  openDate: string // YYYY-MM-DD
  closeDate: string // YYYY-MM-DD
  purchaseValue: number
  saleValue: number
  pnl: number
  closeYear: number
  source: BrokerSource
  anexo: Anexo
  holdingDays?: number | null
  missingBuy?: boolean
  buyCharges?: number
  sellCharges?: number
}

export interface RawDividend {
  ticker: string
  instrument: string
  isin: string
  country: string
  date: string // YYYY-MM-DD
  year: number
  grossEur: number
  withholdingEur: number
  source: BrokerSource
  codigoRendimento: string
}

export interface IRSRow {
  nr: number
  paisFonte: string
  codigo: string
  closeYear: number
  closeMes: string
  closeDia: string
  realValue: number
  openYear: string
  openMes: string
  openDia: string
  aqValue: number
  despesas: number
  imposto: number
  contraparte: string
  instrument: string
  ticker: string
  pnl: number
  source: BrokerSource
  anexo: Anexo
  holdingDays: number | null
  reduction: HoldingReduction | null
  missingBuy: boolean
}

export interface DividendRow {
  nr: number
  codigoRendimento: string
  country: string
  grossEur: number
  withholdingEur: number
  source: BrokerSource
  tickers: string
}

export interface ParseResult {
  trades: RawTrade[]
  dividends: RawDividend[]
}

export interface Totals {
  count: number
  real: number
  aq: number
  pnl: number
  gain: number
  loss: number
  dividends: number
  interest: number
  charges: number
}
