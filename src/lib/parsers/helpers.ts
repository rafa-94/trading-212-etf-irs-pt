export function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let cur = ""
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQ = !inQ
      continue
    }
    if (c === "," && !inQ) {
      result.push(cur.trim())
      cur = ""
      continue
    }
    cur += c
  }
  result.push(cur.trim())
  return result
}

export function parseNum(s: string | undefined | null): number {
  if (!s || s === "-" || s === "") return 0
  const str = String(s).trim()
  const hasDot = str.includes(".")
  const hasComma = str.includes(",")
  if (hasDot && !hasComma) return parseFloat(str) || 0
  if (hasComma && !hasDot) return parseFloat(str.replace(",", ".")) || 0
  if (hasComma && hasDot)
    return parseFloat(str.replace(/\./g, "").replace(",", ".")) || 0
  return parseFloat(str) || 0
}

export function fmtDate(s: string | undefined | null): string {
  if (!s) return ""
  const d = s.split(" ")[0]
  const [y, m, dd] = d.split("-")
  return `${y}-${m}-${dd}`
}

export function findCol(
  row: Record<string, string>,
  candidates: string[]
): string {
  for (const c of candidates) {
    for (const k of Object.keys(row)) {
      if (k.toLowerCase().includes(c.toLowerCase())) return row[k]
    }
  }
  return ""
}
