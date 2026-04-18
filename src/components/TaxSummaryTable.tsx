import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BarChart3 } from "lucide-react"
import { formatEuros, formatPercent } from "@/lib/taxCalculator"
import type { TaxBreakdown } from "@/types"

interface Props {
  breakdown: TaxBreakdown
  ca: number
}

interface Row {
  label: string
  annuel: number
  mensuel: number
  taux?: number
  isTotal?: boolean
  isPositive?: boolean
}

export function TaxSummaryTable({ breakdown, ca }: Props) {
  if (ca === 0) return null

  const rows: Row[] = [
    {
      label: "Chiffre d'affaires",
      annuel: ca,
      mensuel: ca / 12,
      taux: 1,
    },
    {
      label: "Cotisations sociales",
      annuel: breakdown.cotisationsSociales,
      mensuel: breakdown.cotisationsSociales / 12,
      taux: breakdown.cotisationsRate,
    },
    {
      label: "Formation professionnelle (CFP)",
      annuel: breakdown.cfp,
      mensuel: breakdown.cfp / 12,
      taux: breakdown.cfpRate,
    },
    ...(breakdown.versementLiberatoireRate > 0
      ? [
          {
            label: "Versement libératoire (IR)",
            annuel: breakdown.versementLiberatoire,
            mensuel: breakdown.versementLiberatoire / 12,
            taux: breakdown.versementLiberatoireRate,
          },
        ]
      : []),
    {
      label: "Total charges",
      annuel: breakdown.totalCharges,
      mensuel: breakdown.totalCharges / 12,
      taux: breakdown.totalRate,
      isTotal: true,
    },
    {
      label: "Revenu net disponible",
      annuel: breakdown.revenueNetImpot,
      mensuel: breakdown.revenueNetImpot / 12,
      taux: breakdown.revenueNetImpot / ca,
      isTotal: true,
      isPositive: true,
    },
  ]

  return (
    <Card className="border border-border/60">
      <CardHeader className="pb-2 pt-5 px-5">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/80">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          Récapitulatif annuel / mensuel
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)", background: "oklch(1 0 0 / 3%)" }}>
                <th className="text-left pl-5 pr-2 py-2.5 text-[11px] font-medium text-muted-foreground/60 tracking-wide uppercase">
                  Poste
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-medium text-muted-foreground/60 tracking-wide uppercase">
                  Taux
                </th>
                <th className="text-right px-3 py-2.5 text-[11px] font-medium text-muted-foreground/60 tracking-wide uppercase">
                  Annuel
                </th>
                <th className="text-right pl-3 pr-5 py-2.5 text-[11px] font-medium text-muted-foreground/60 tracking-wide uppercase">
                  Mensuel
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isChargesRow = !row.isPositive && !row.label.includes("Chiffre")
                return (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < rows.length - 1 ? "1px solid oklch(1 0 0 / 5%)" : "none",
                      background: row.isTotal ? "oklch(1 0 0 / 3%)" : "transparent",
                    }}
                  >
                    <td className={`pl-5 pr-2 py-3 ${row.isTotal ? "font-medium text-foreground/90" : "text-muted-foreground"}`}>
                      {row.label}
                    </td>
                    <td className="px-3 py-3 text-right text-xs text-muted-foreground/50 tabular-nums">
                      {row.taux !== undefined ? formatPercent(row.taux) : "—"}
                    </td>
                    <td
                      className="px-3 py-3 text-right tabular-nums font-medium"
                      style={{
                        color: isChargesRow
                          ? "oklch(0.68 0.2 22)"
                          : row.isPositive
                          ? "oklch(0.72 0.17 155)"
                          : "oklch(0.80 0.15 82)",
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: "1.05rem",
                      }}
                    >
                      {isChargesRow ? "−" : ""}{formatEuros(Math.abs(row.annuel))}
                    </td>
                    <td
                      className="pl-3 pr-5 py-3 text-right tabular-nums"
                      style={{
                        color: isChargesRow
                          ? "oklch(0.68 0.2 22 / 80%)"
                          : row.isPositive
                          ? "oklch(0.72 0.17 155 / 80%)"
                          : "oklch(0.95 0.006 85 / 60%)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {isChargesRow ? "−" : ""}{formatEuros(Math.abs(row.mensuel))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!breakdown.isSoumiseTVA && breakdown.revenueNetImpot > 0 && (
          <div className="px-5 pt-4">
            <Separator className="mb-4 opacity-30" />
            <p className="text-xs text-muted-foreground/60 leading-relaxed">
              <strong className="text-muted-foreground/80">Note IR :</strong>{" "}
              Sans versement libératoire, vous devrez déclarer{" "}
              <strong className="text-foreground/70 tabular-nums">
                {formatEuros(breakdown.baseTaxableImpotRevenu)}
              </strong>{" "}
              de revenu imposable (après abattement de {formatPercent(breakdown.abattementRate, 0)}).
              L'impôt réel dépend de votre situation familiale et autres revenus.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
