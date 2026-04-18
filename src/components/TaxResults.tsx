import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react"
import { formatEuros, formatPercent } from "@/lib/taxCalculator"
import type { TaxBreakdown, PaymentFrequency } from "@/types"

interface Props {
  breakdown: TaxBreakdown
  frequency: PaymentFrequency
  ca: number
}

function ResultRow({
  label,
  value,
  highlight = false,
  negative = false,
  tooltip,
  rate,
}: {
  label: string
  value: number
  highlight?: boolean
  negative?: boolean
  tooltip?: string
  rate?: number
}) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${highlight ? "font-medium" : "text-sm"}`}
    >
      <div className="flex items-center gap-1.5">
        <span className={highlight ? "text-foreground/90" : "text-muted-foreground"}>
          {label}
        </span>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/50 cursor-help shrink-0" />
            </TooltipTrigger>
            <TooltipContent className="max-w-56 text-xs leading-relaxed bg-card border-border">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {rate !== undefined && (
          <span className="text-xs text-muted-foreground/50 tabular-nums">
            ({formatPercent(rate)})
          </span>
        )}
        <span
          className={`tabular-nums ${
            negative
              ? "text-danger"
              : highlight
              ? "text-foreground"
              : "text-foreground/80"
          }`}
          style={negative ? { color: "oklch(0.68 0.2 22)" } : undefined}
        >
          {negative ? "−" : ""}{formatEuros(Math.abs(value))}
        </span>
      </div>
    </div>
  )
}

export function TaxResults({ breakdown, frequency, ca }: Props) {
  const mult = frequency === "monthly" ? 1 / 12 : frequency === "quarterly" ? 1 / 4 : 1
  const periodLabel = frequency === "monthly" ? "par mois" : frequency === "quarterly" ? "par trimestre" : "par an"
  const declarations = frequency === "monthly" ? 12 : 4

  if (ca === 0) {
    return (
      <Card className="border-dashed border-border/40 bg-card/30">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div
            className="font-display text-7xl opacity-10 select-none"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "oklch(0.80 0.15 82)" }}
            aria-hidden
          >
            €
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            Renseignez votre chiffre d'affaires pour voir le détail de vos charges.
          </p>
        </CardContent>
      </Card>
    )
  }

  const periodCA = ca * mult
  const periodCotisations = breakdown.cotisationsSociales * mult
  const periodCFP = breakdown.cfp * mult
  const periodVL = breakdown.versementLiberatoire * mult
  const periodTotal = breakdown.totalCharges * mult
  const periodNet = breakdown.revenueNetImpot * mult

  return (
    <div className="space-y-4">

      {/* ── Résumé 3 chiffres clés ──────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {/* CA */}
        <Card className="border col-span-1 card-gold">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-[11px] tracking-wide uppercase mb-2 font-medium"
               style={{ color: "oklch(0.80 0.15 82 / 70%)" }}>
              CA {periodLabel}
            </p>
            <p
              className="text-2xl font-semibold leading-none tabular-nums"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "oklch(0.80 0.15 82)" }}
            >
              {formatEuros(periodCA)}
            </p>
          </CardContent>
        </Card>

        {/* Charges */}
        <Card className="border col-span-1 card-danger">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-[11px] tracking-wide uppercase mb-2 font-medium"
               style={{ color: "oklch(0.68 0.2 22 / 70%)" }}>
              Charges
            </p>
            <p
              className="text-2xl font-semibold leading-none tabular-nums"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "oklch(0.68 0.2 22)" }}
            >
              {formatEuros(periodTotal)}
            </p>
            <p className="text-[11px] mt-1.5 tabular-nums" style={{ color: "oklch(0.68 0.2 22 / 60%)" }}>
              {formatPercent(breakdown.totalRate)}
            </p>
          </CardContent>
        </Card>

        {/* Net */}
        <Card className="border col-span-1 card-success">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-[11px] tracking-wide uppercase mb-2 font-medium"
               style={{ color: "oklch(0.72 0.17 155 / 70%)" }}>
              Net
            </p>
            <p
              className="text-2xl font-semibold leading-none tabular-nums"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "oklch(0.72 0.17 155)" }}
            >
              {formatEuros(periodNet)}
            </p>
            <p className="text-[11px] mt-1.5 tabular-nums" style={{ color: "oklch(0.72 0.17 155 / 60%)" }}>
              {formatPercent(breakdown.revenueNetImpot / ca)} du CA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Détail des charges ──────────────────────── */}
      <Card className="border border-border/60">
        <CardHeader className="pb-1 pt-5 px-5">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/80">
            <TrendingDown className="h-3.5 w-3.5" style={{ color: "oklch(0.68 0.2 22)" }} />
            Détail des charges
            <span className="text-xs font-normal text-muted-foreground ml-1">({periodLabel})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-0">
          <ResultRow
            label="CA brut"
            value={periodCA}
            highlight
            rate={1}
          />
          <Separator className="opacity-30" />
          <ResultRow
            label="Cotisations sociales"
            value={periodCotisations}
            negative
            rate={breakdown.cotisationsRate}
            tooltip="Retraite, maladie, maternité, invalidité, allocations familiales. Calculées sur votre CA brut."
          />
          <ResultRow
            label="Contribution formation prof. (CFP)"
            value={periodCFP}
            negative
            rate={breakdown.cfpRate}
            tooltip="Permet de financer votre accès à la formation professionnelle."
          />
          {breakdown.versementLiberatoireRate > 0 && (
            <ResultRow
              label="Versement libératoire (IR)"
              value={periodVL}
              negative
              rate={breakdown.versementLiberatoireRate}
              tooltip="Impôt sur le revenu payé en même temps que les cotisations sociales. Taux fixe avantageux."
            />
          )}
          <Separator className="opacity-30" />
          <ResultRow
            label={`Total charges ${periodLabel}`}
            value={periodTotal}
            highlight
            negative
            rate={breakdown.totalRate}
          />
          <ResultRow
            label={`Net disponible ${periodLabel}`}
            value={periodNet}
            highlight
          />
        </CardContent>
      </Card>

      {/* ── IR barème progressif ────────────────────── */}
      {breakdown.versementLiberatoireRate === 0 && (
        <Card className="border card-warning">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-medium flex items-center gap-2"
                       style={{ color: "oklch(0.78 0.17 65)" }}>
              <AlertCircle className="h-3.5 w-3.5" style={{ color: "oklch(0.78 0.17 65)" }} />
              Impôt sur le revenu (barème progressif)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sans versement libératoire, votre IR est calculé sur votre revenu net imposable après abattement forfaitaire.
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CA annuel</span>
                <span className="tabular-nums">{formatEuros(ca)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Abattement forfaitaire ({formatPercent(breakdown.abattementRate, 0)})
                </span>
                <span className="tabular-nums" style={{ color: "oklch(0.72 0.17 155)" }}>
                  −{formatEuros(ca * breakdown.abattementRate)}
                </span>
              </div>
              <Separator className="opacity-30" />
              <div className="flex justify-between text-sm font-medium">
                <span>Revenu imposable estimé</span>
                <span className="tabular-nums">{formatEuros(breakdown.baseTaxableImpotRevenu)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-md"
               style={{ background: "oklch(0.78 0.17 65 / 8%)", borderLeft: "2px solid oklch(0.78 0.17 65 / 40%)" }}>
              Ce montant s'ajoute à vos autres revenus et est soumis au barème progressif (0 % à 45 %).
              Simulez sur impôts.gouv.fr pour un calcul précis.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── TVA ────────────────────────────────────── */}
      <Card className={`border ${breakdown.isSoumiseTVA ? "card-info" : "border-border/30 opacity-70"}`}>
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="text-sm font-medium flex items-center gap-2"
                     style={{ color: breakdown.isSoumiseTVA ? "oklch(0.68 0.16 270)" : undefined }}>
            {breakdown.isSoumiseTVA ? (
              <AlertCircle className="h-3.5 w-3.5" style={{ color: "oklch(0.68 0.16 270)" }} />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: "oklch(0.72 0.17 155)" }} />
            )}
            TVA
            <Badge
              variant="outline"
              className="text-[10px] px-1.5"
              style={breakdown.isSoumiseTVA
                ? { borderColor: "oklch(0.68 0.16 270 / 40%)", color: "oklch(0.68 0.16 270)" }
                : { borderColor: "oklch(0.72 0.17 155 / 40%)", color: "oklch(0.72 0.17 155)" }}
            >
              {breakdown.isSoumiseTVA ? "Assujetti" : "Franchise en base"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {!breakdown.isSoumiseTVA ? (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vous bénéficiez de la franchise en base de TVA. Vous ne facturez pas la TVA
              à vos clients et ne la récupérez pas sur vos achats.{" "}
              <em className="not-italic opacity-80">
                Mention obligatoire sur vos factures : « TVA non applicable – art. 293 B du CGI »
              </em>
            </p>
          ) : (
            <div className="space-y-0">
              <ResultRow
                label="TVA collectée (20% sur ventes)"
                value={breakdown.tvaCollectee}
                tooltip="TVA que vous facturez à vos clients et reversez à l'État."
              />
              <ResultRow
                label="TVA déductible (achats)"
                value={breakdown.tvaDeductible}
                negative
                tooltip="TVA récupérable sur vos achats professionnels."
              />
              <Separator className="opacity-30" />
              <ResultRow
                label="TVA nette à reverser"
                value={breakdown.tvaNette}
                highlight
                negative
                tooltip="Montant à déclarer et payer à l'administration fiscale."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Plafond CA ──────────────────────────────── */}
      <Card className="border border-border/60">
        <CardHeader className="pb-2 pt-5 px-5">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/80">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Plafond de chiffre d'affaires
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CA actuel</span>
            <span className="font-medium tabular-nums">{formatEuros(ca)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plafond régime</span>
            <span className="font-medium tabular-nums">{formatEuros(breakdown.plafondCA)}</span>
          </div>
          {/* Progress bar */}
          <div className="relative h-2 w-full rounded-full overflow-hidden"
               style={{ background: "oklch(1 0 0 / 8%)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(breakdown.tauxRemplissagePlafond, 100)}%`,
                background: breakdown.tauxRemplissagePlafond < 70
                  ? "oklch(0.72 0.17 155)"
                  : breakdown.tauxRemplissagePlafond < 90
                  ? "oklch(0.78 0.17 65)"
                  : "oklch(0.68 0.2 22)",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {breakdown.tauxRemplissagePlafond < 100 ? (
              <>
                Marge disponible :{" "}
                <strong className="text-foreground/80">
                  {formatEuros(breakdown.plafondCA - ca)}
                </strong>{" "}
                ({(100 - breakdown.tauxRemplissagePlafond).toFixed(0)} %)
              </>
            ) : (
              <span style={{ color: "oklch(0.68 0.2 22)" }} className="font-medium">
                Plafond dépassé — votre statut d'auto-entrepreneur est remis en cause.
                Consultez un expert-comptable.
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground/60">
            Déclarations : <strong className="text-muted-foreground">{declarations}×/an</strong>{" "}
            ({frequency === "monthly" ? "mensuel" : "trimestriel"})
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
