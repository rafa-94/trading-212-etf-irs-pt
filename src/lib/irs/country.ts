import countryData from "./contry_code.json"
import fiscalParadisesData from "./fiscal_paradises.json"

const alpha2ToCode: Record<string, string> = {}
for (const entry of countryData) {
  alpha2ToCode[entry.alpha_2] = entry.code
}

const fiscalParadiseSet = new Set(fiscalParadisesData.map((e) => e.alpha_2))

export function getCountryCodeFromAlpha2(alpha2: string): string | undefined {
  return alpha2ToCode[alpha2.toUpperCase()]
}

export function isFiscalParadise(alpha2: string): boolean {
  return fiscalParadiseSet.has(alpha2.toUpperCase())
}
