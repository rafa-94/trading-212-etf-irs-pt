import type { IRSRow, DividendRow } from "@/lib/types"

const XML_NS = "http://www.dgci.gov.pt/2009/Modelo3IRSv2026"
const NIF_XTB_PORTUGAL = "980436613"
const CORRECT_ROOT_OPEN = [
  "<Modelo3IRSv2026",
  ' xmlns="http://www.dgci.gov.pt/2009/Modelo3IRSv2026"',
  ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  ' versao="1"',
  ' xsi:schemaLocation="http://www.dgci.gov.pt/2009/Modelo3IRSv2026 Modelo3IRSv2026.xsd">',
].join("")

export interface XmlValidation {
  valid: boolean
  year: string
  nif: string
  error?: string
}

export function validateXML(xmlText: string): XmlValidation {
  const doc = new DOMParser().parseFromString(xmlText, "application/xml")
  const parseErr = doc.querySelector("parsererror")
  if (parseErr)
    return {
      valid: false,
      year: "",
      nif: "",
      error: "XML inválido: " + parseErr.textContent?.slice(0, 120),
    }
  if (!doc.documentElement.tagName.includes("Modelo3IRS")) {
    return {
      valid: false,
      year: "",
      nif: "",
      error:
        "Ficheiro não é um Modelo 3 IRS. Exporta a declaração no Portal das Finanças.",
    }
  }
  const year =
    doc.getElementsByTagNameNS(XML_NS, "Q02C01")[0]?.textContent ?? ""
  const nif = doc.getElementsByTagNameNS(XML_NS, "Q03C01")[0]?.textContent ?? ""
  return { valid: true, year, nif }
}

export function injectIntoXML(
  originalXmlText: string,
  allRows: IRSRow[],
  dividendRows: DividendRow[],
  titular: "A" | "B"
): string {
  const doc = new DOMParser().parseFromString(
    originalXmlText,
    "application/xml"
  )
  const parseErr = doc.querySelector("parsererror")
  if (parseErr)
    throw new Error("XML inválido: " + parseErr.textContent?.slice(0, 100))

  const annexGRows = allRows.filter((r) => r.anexo === "G")
  const annexJRows = allRows.filter((r) => r.anexo === "J")

  function makeElem(tag: string, text?: string | number): Element {
    const e = doc.createElementNS(XML_NS, tag)
    if (text !== undefined && text !== null && text !== "")
      e.textContent = String(text)
    return e
  }
  function removeAllChildren(node: Element) {
    while (node.firstChild) node.removeChild(node.firstChild)
  }
  function findOrCreate(parent: Element, tag: string): Element {
    let found = parent.getElementsByTagNameNS(XML_NS, tag)[0]
    if (!found) {
      found = makeElem(tag)
      parent.appendChild(found)
    }
    return found
  }
  function setOrUpdateText(parent: Element, tag: string, val: string) {
    let e = parent.getElementsByTagNameNS(XML_NS, tag)[0]
    if (!e) {
      e = makeElem(tag)
      parent.appendChild(e)
    }
    e.textContent = val
  }

  const root = doc.documentElement

  if (annexGRows.length > 0) {
    const anexoG = findOrCreate(root, "AnexoG")
    const quadro09G = findOrCreate(anexoG, "Quadro09")
    const annexGTable = findOrCreate(quadro09G, "AnexoGq09T01")
    removeAllChildren(annexGTable)
    annexGRows.forEach((r, i) => {
      const linha = makeElem("AnexoGq09T01-Linha")
      linha.setAttribute("numero", String(i + 1))
      const fields: Array<[string, string | number]> = [
        ["NLinha", 9001 + i],
        ["Titular", titular],
        ["NIF", NIF_XTB_PORTUGAL],
        ["CodEncargos", r.codigo],
        ["AnoRealizacao", r.closeYear],
        ["MesRealizacao", parseInt(r.closeMes)],
        ["DiaRealizacao", parseInt(r.closeDia)],
        ["ValorRealizacao", r.realValue.toFixed(2)],
      ]
      if (r.openYear) {
        fields.push(
          ["AnoAquisicao", r.openYear],
          ["MesAquisicao", parseInt(r.openMes)],
          ["DiaAquisicao", parseInt(r.openDia)],
          ["ValorAquisicao", r.aqValue.toFixed(2)]
        )
      }
      fields.push(["DespesasEncargos", "0.00"], ["PaisContraparte", "620"])
      fields.forEach(([tag, val]) => linha.appendChild(makeElem(tag, val)))
      annexGTable.appendChild(linha)
    })
    setOrUpdateText(
      quadro09G,
      "AnexoGq09T01SomaC01",
      annexGRows.reduce((s, r) => s + r.realValue, 0).toFixed(2)
    )
    setOrUpdateText(
      quadro09G,
      "AnexoGq09T01SomaC02",
      annexGRows.reduce((s, r) => s + r.aqValue, 0).toFixed(2)
    )
    setOrUpdateText(quadro09G, "AnexoGq09T01SomaC03", "0.00")
  }

  if (annexJRows.length > 0) {
    let anexoJ = root.getElementsByTagNameNS(XML_NS, "AnexoJ")[0]
    if (!anexoJ) {
      const nif =
        root.getElementsByTagNameNS(XML_NS, "Q03C01")[0]?.textContent ?? ""
      const year =
        root.getElementsByTagNameNS(XML_NS, "Q02C01")[0]?.textContent ??
        String(new Date().getFullYear())
      anexoJ = makeElem("AnexoJ")
      if (nif) anexoJ.setAttribute("id", nif)
      root.appendChild(anexoJ)
      const q02 = makeElem("Quadro02")
      q02.appendChild(makeElem("AnexoJq02C01", year))
      anexoJ.appendChild(q02)
      const q03 = makeElem("Quadro03")
      q03.appendChild(makeElem("AnexoJq03C01", nif))
      q03.appendChild(makeElem("AnexoJq03C03", nif))
      anexoJ.appendChild(q03)
      ;["Quadro04", "Quadro05", "Quadro06", "Quadro07", "Quadro08"].forEach(
        (t) => anexoJ.appendChild(makeElem(t))
      )
    }
    const quadro09J = findOrCreate(anexoJ, "Quadro09")
    findOrCreate(quadro09J, "AnexoJq091AT01")
    findOrCreate(quadro09J, "AnexoJq091BT01")
    const annexJTable = findOrCreate(quadro09J, "AnexoJq092AT01")
    removeAllChildren(annexJTable)
    annexJRows.forEach((r, i) => {
      const linha = makeElem("AnexoJq092AT01-Linha")
      linha.setAttribute("numero", String(i + 1))
      const fields: Array<[string, string | number]> = [
        ["NLinha", 951 + i],
        ["CodPais", r.paisFonte],
        ["Codigo", r.codigo],
        ["AnoRealizacao", r.closeYear],
        ["MesRealizacao", parseInt(r.closeMes)],
        ["DiaRealizacao", parseInt(r.closeDia)],
        ["ValorRealizacao", r.realValue.toFixed(2)],
      ]
      if (r.openYear) {
        fields.push(
          ["AnoAquisicao", r.openYear],
          ["MesAquisicao", parseInt(r.openMes)],
          ["DiaAquisicao", parseInt(r.openDia)]
        )
      }
      fields.push(
        ["ValorAquisicao", r.aqValue.toFixed(2)],
        ["DespesasEncargos", "0.00"],
        ["ImpostoPagoNoEstrangeiro", "0.00"],
        ["CodPaisContraparte", "620"]
      )
      fields.forEach(([tag, val]) => linha.appendChild(makeElem(tag, val)))
      annexJTable.appendChild(linha)
    })
    setOrUpdateText(
      quadro09J,
      "AnexoJq092AT01SomaC01",
      annexJRows.reduce((s, r) => s + r.realValue, 0).toFixed(2)
    )
    setOrUpdateText(
      quadro09J,
      "AnexoJq092AT01SomaC02",
      annexJRows.reduce((s, r) => s + r.aqValue, 0).toFixed(2)
    )
    setOrUpdateText(quadro09J, "AnexoJq092AT01SomaC03", "0.00")
    setOrUpdateText(quadro09J, "AnexoJq092AT01SomaC04", "0.00")
    findOrCreate(quadro09J, "AnexoJq092A1T01")
    findOrCreate(quadro09J, "AnexoJq092BT01")
    findOrCreate(quadro09J, "AnexoJq094AT01")
    findOrCreate(anexoJ, "Quadro10")
    findOrCreate(anexoJ, "Quadro11")
  }

  if (dividendRows?.length > 0) {
    let anexoJDiv = root.getElementsByTagNameNS(XML_NS, "AnexoJ")[0]
    if (!anexoJDiv) {
      anexoJDiv = makeElem("AnexoJ")
      const nif =
        root.getElementsByTagNameNS(XML_NS, "Q03C01")[0]?.textContent ?? ""
      if (nif) anexoJDiv.setAttribute("id", nif)
      root.appendChild(anexoJDiv)
    }
    const quadro08J = findOrCreate(anexoJDiv, "Quadro08")
    const divTable = findOrCreate(quadro08J, "AnexoJq08AT01")
    removeAllChildren(divTable)
    dividendRows.forEach((r, i) => {
      const linha = makeElem("AnexoJq08AT01-Linha")
      linha.setAttribute("numero", String(i + 1))
      ;[
        ["NLinha", 800 + i + 1],
        ["CodRendimento", r.codigoRendimento],
        ["PaisFont", r.country],
        ["RendimentoBruto", r.grossEur.toFixed(2)],
        ["ImpostoPagoNoEstrangeiro", r.withholdingEur.toFixed(2)],
        ["CodPaisContraparte", "620"],
      ].forEach(([tag, val]) =>
        linha.appendChild(makeElem(tag as string, val as string))
      )
      divTable.appendChild(linha)
    })
    setOrUpdateText(
      quadro08J,
      "AnexoJq08AT01SomaC01",
      dividendRows.reduce((s, r) => s + r.grossEur, 0).toFixed(2)
    )
    setOrUpdateText(
      quadro08J,
      "AnexoJq08AT01SomaC02",
      dividendRows.reduce((s, r) => s + r.withholdingEur, 0).toFixed(2)
    )
  }

  const serializer = new XMLSerializer()
  let xmlOut = serializer.serializeToString(doc)
  xmlOut = xmlOut.replace(/^<[?][^?]*[?]>\s*/i, "")
  xmlOut = xmlOut.replace(/^<Modelo3IRSv2026[^>]*>/, CORRECT_ROOT_OPEN)
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlOut
}
