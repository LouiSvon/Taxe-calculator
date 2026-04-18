import type { ActivityType } from "@/types"

/**
 * Taux et seuils fiscaux pour les micro-entrepreneurs en France (2025)
 * Sources : service-public.fr, impots.gouv.fr, urssaf.fr
 */

// ─── Cotisations sociales ─────────────────────────────────────────────────────

export const COTISATIONS_RATES: Record<ActivityType, number> = {
  bic_vente: 0.123,       // 12,3% — commerce, vente, hébergement
  bic_services: 0.212,    // 21,2% — services BIC (artisans, etc.)
  bnc_regulated: 0.232,   // 23,2% — libéraux réglementés (CIPAV)
  bnc_unregulated: 0.246, // 24,6% — libéraux non réglementés (URSSAF)
}

// Taux réduit ACRE (50% pendant 12 mois pour création 2025)
export const ACRE_REDUCTION = 0.5 // 50% de réduction

// ─── Contribution à la formation professionnelle (CFP) ───────────────────────

export const CFP_RATES: Record<ActivityType, number> = {
  bic_vente: 0.001,       // 0,10%
  bic_services: 0.003,    // 0,30% — artisans
  bnc_regulated: 0.002,   // 0,20%
  bnc_unregulated: 0.001, // 0,10%
}

// ─── Versement libératoire de l'impôt sur le revenu ─────────────────────────

export const VERSEMENT_LIBERATOIRE_RATES: Record<ActivityType, number> = {
  bic_vente: 0.01,        // 1,0%
  bic_services: 0.017,    // 1,7%
  bnc_regulated: 0.022,   // 2,2%
  bnc_unregulated: 0.022, // 2,2%
}

// ─── Abattement forfaitaire (calcul IR si PAS versement libératoire) ─────────

export const ABATTEMENT_RATES: Record<ActivityType, number> = {
  bic_vente: 0.71,        // 71%
  bic_services: 0.50,     // 50%
  bnc_regulated: 0.34,    // 34%
  bnc_unregulated: 0.34,  // 34%
}

// ─── Plafonds de chiffre d'affaires 2025 ─────────────────────────────────────

export const CA_PLAFONDS: Record<ActivityType, number> = {
  bic_vente: 188_800,
  bic_services: 77_700,
  bnc_regulated: 77_700,
  bnc_unregulated: 77_700,
}

// ─── Seuils franchise en base de TVA 2025 ────────────────────────────────────

export const TVA_FRANCHISE_SEUILS: Record<ActivityType, { normal: number; majore: number }> = {
  bic_vente: { normal: 85_000, majore: 93_500 },
  bic_services: { normal: 37_500, majore: 41_250 },
  bnc_regulated: { normal: 37_500, majore: 41_250 },
  bnc_unregulated: { normal: 37_500, majore: 41_250 },
}

// ─── Labels d'affichage ───────────────────────────────────────────────────────

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  bic_vente: "Commerce / Vente / Hébergement (BIC)",
  bic_services: "Services artisanaux ou commerciaux (BIC)",
  bnc_regulated: "Profession libérale réglementée CIPAV (BNC)",
  bnc_unregulated: "Profession libérale non réglementée (BNC)",
}

export const ACTIVITY_EXAMPLES: Record<ActivityType, string> = {
  bic_vente: "Boutique, e-commerce, restauration, gîte, chambre d'hôtes",
  bic_services: "Artisan, plombier, électricien, coiffeur, réparateur",
  bnc_regulated: "Architecte, expert-comptable, médecin, avocat, kinésithérapeute",
  bnc_unregulated: "Consultant, formateur, graphiste, développeur, coach",
}

// ─── Taux de TVA disponibles ──────────────────────────────────────────────────

export const TVA_RATES_LABELS: Record<number, string> = {
  0: "0% — Exonéré",
  5.5: "5,5% — Taux réduit (alimentation, livres...)",
  10: "10% — Taux intermédiaire (restauration, travaux...)",
  20: "20% — Taux normal",
}
