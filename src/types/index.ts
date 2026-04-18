export type ActivityType =
  | "bic_vente"       // Commerce, vente de marchandises, hébergement BnB
  | "bic_services"    // Prestations de services commerciales ou artisanales
  | "bnc_regulated"   // Professions libérales réglementées (CIPAV)
  | "bnc_unregulated" // Professions libérales non réglementées

export type PaymentFrequency = "monthly" | "quarterly"

export interface Purchase {
  id: string
  description: string
  amountHT: number
  tvaRate: TVARate
}

export type TVARate = 0 | 5.5 | 10 | 20

export interface CalculatorState {
  ca: number
  activityType: ActivityType
  frequency: PaymentFrequency
  hasACRE: boolean
  hasVersementLiberatoire: boolean
  purchases: Purchase[]
  periodMonths: number // 1 = mensuel, 3 = trimestriel, 12 = annuel
}

export interface TaxBreakdown {
  // Cotisations sociales
  cotisationsSociales: number
  cotisationsRate: number

  // Contribution à la formation professionnelle
  cfp: number
  cfpRate: number

  // Versement libératoire (impôt)
  versementLiberatoire: number
  versementLiberatoireRate: number

  // Total cotisations + impôt
  totalCharges: number
  totalRate: number

  // Revenus
  caNet: number           // CA après cotisations sociales
  revenueNetImpot: number // CA net après toutes charges

  // Abattement forfaitaire (info)
  abattementRate: number
  baseTaxableImpotRevenu: number // si PAS versement libératoire

  // TVA
  isSoumiseTVA: boolean
  tvaCollectee: number    // TVA collectée sur les ventes (si assujetti)
  tvaDeductible: number   // TVA déductible sur achats (si assujetti)
  tvaNette: number        // TVA à payer

  // Plafonds
  plafondCA: number
  tauxRemplissagePlafond: number // % du plafond atteint
}

export interface SimulationResult {
  period: "annual" | "monthly" | "quarterly"
  breakdown: TaxBreakdown
}
