import type { CalculatorState, TaxBreakdown } from "@/types"
import {
  COTISATIONS_RATES,
  CFP_RATES,
  VERSEMENT_LIBERATOIRE_RATES,
  ABATTEMENT_RATES,
  CA_PLAFONDS,
  TVA_FRANCHISE_SEUILS,
  ACRE_REDUCTION,
} from "@/lib/taxRates"

/**
 * Calcule l'ensemble des charges fiscales et sociales d'un micro-entrepreneur.
 * Toutes les valeurs sont annualisées, puis le résultat peut être divisé
 * par la fréquence choisie pour l'affichage.
 */
export function calculateTaxes(state: CalculatorState): TaxBreakdown {
  const { ca, activityType, hasACRE, hasVersementLiberatoire, purchases } = state

  // ── Cotisations sociales ───────────────────────────────────────────────────
  let cotisationsRate = COTISATIONS_RATES[activityType]
  if (hasACRE) cotisationsRate *= 1 - ACRE_REDUCTION
  const cotisationsSociales = ca * cotisationsRate

  // ── CFP ───────────────────────────────────────────────────────────────────
  const cfpRate = CFP_RATES[activityType]
  const cfp = ca * cfpRate

  // ── Versement libératoire ─────────────────────────────────────────────────
  const versementLiberatoireRate = hasVersementLiberatoire
    ? VERSEMENT_LIBERATOIRE_RATES[activityType]
    : 0
  const versementLiberatoire = ca * versementLiberatoireRate

  // ── Total ─────────────────────────────────────────────────────────────────
  const totalCharges = cotisationsSociales + cfp + versementLiberatoire
  const totalRate = cotisationsRate + cfpRate + versementLiberatoireRate

  // ── Revenus nets ──────────────────────────────────────────────────────────
  const caNet = ca - cotisationsSociales - cfp
  const revenueNetImpot = ca - totalCharges

  // ── Abattement forfaitaire (info pour calcul IR classique) ────────────────
  const abattementRate = ABATTEMENT_RATES[activityType]
  const baseTaxableImpotRevenu = ca * (1 - abattementRate)

  // ── TVA ───────────────────────────────────────────────────────────────────
  const tvaSeuil = TVA_FRANCHISE_SEUILS[activityType]
  const isSoumiseTVA = ca > tvaSeuil.normal

  // TVA collectée sur ventes (20% par défaut si assujetti)
  const tvaCollectee = isSoumiseTVA ? ca * 0.2 : 0

  // TVA déductible sur achats
  const tvaDeductible = purchases.reduce((sum, p) => {
    if (!isSoumiseTVA) return sum
    const tvaAmount = p.amountHT * (p.tvaRate / 100)
    return sum + tvaAmount
  }, 0)

  const tvaNette = Math.max(0, tvaCollectee - tvaDeductible)

  // ── Plafonds ──────────────────────────────────────────────────────────────
  const plafondCA = CA_PLAFONDS[activityType]
  const tauxRemplissagePlafond = Math.min((ca / plafondCA) * 100, 100)

  return {
    cotisationsSociales,
    cotisationsRate,
    cfp,
    cfpRate,
    versementLiberatoire,
    versementLiberatoireRate,
    totalCharges,
    totalRate,
    caNet,
    revenueNetImpot,
    abattementRate,
    baseTaxableImpotRevenu,
    isSoumiseTVA,
    tvaCollectee,
    tvaDeductible,
    tvaNette,
    plafondCA,
    tauxRemplissagePlafond,
  }
}

/**
 * Formate un montant en euros avec séparateur de milliers.
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formate un taux en pourcentage.
 */
export function formatPercent(rate: number, decimals = 1): string {
  return `${(rate * 100).toFixed(decimals)} %`
}

/**
 * Divise un montant annuel selon la fréquence choisie.
 */
export function periodDivider(
  annualAmount: number,
  periodMonths: number
): number {
  return annualAmount * (periodMonths / 12)
}
