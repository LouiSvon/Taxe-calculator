import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import type { PaymentFrequency } from "@/types"

interface Props {
  hasACRE: boolean
  onACREChange: (v: boolean) => void
  hasVersementLiberatoire: boolean
  onVersementChange: (v: boolean) => void
  frequency: PaymentFrequency
  onFrequencyChange: (v: PaymentFrequency) => void
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-64 text-xs leading-relaxed bg-card border-border">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export function OptionsPanel({
  hasACRE,
  onACREChange,
  hasVersementLiberatoire,
  onVersementChange,
  frequency,
  onFrequencyChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Fréquence de déclaration */}
      <div>
        <Label className="text-sm font-medium mb-2.5 block text-foreground/80">
          Fréquence de déclaration
        </Label>
        <div className="flex gap-2">
          {(["monthly", "quarterly"] as PaymentFrequency[]).map((f) => (
            <button
              key={f}
              onClick={() => onFrequencyChange(f)}
              className={`flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                frequency === f
                  ? "border-primary/50 text-primary-foreground"
                  : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
              style={frequency === f ? { background: "oklch(0.80 0.15 82 / 20%)", color: "oklch(0.80 0.15 82)" } : undefined}
            >
              {f === "monthly" ? "Mensuelle" : "Trimestrielle"}
            </button>
          ))}
        </div>
      </div>

      <Separator className="opacity-30" />

      {/* ACRE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="acre-switch" className="text-sm font-medium cursor-pointer text-foreground/80">
            Bénéficiaire de l'ACRE
          </Label>
          <InfoTooltip text="L'Aide à la Création ou Reprise d'Entreprise (ACRE) permet de bénéficier d'une réduction de 50% sur les cotisations sociales pendant les 12 premiers mois d'activité. Sous conditions de ressources et de situation." />
        </div>
        <Switch
          id="acre-switch"
          checked={hasACRE}
          onCheckedChange={onACREChange}
        />
      </div>

      {hasACRE && (
        <p
          className="text-xs text-muted-foreground leading-relaxed p-2.5 rounded-md"
          style={{ background: "oklch(0.68 0.16 270 / 8%)", borderLeft: "2px solid oklch(0.68 0.16 270 / 40%)" }}
        >
          Réduction de 50 % sur les cotisations sociales pendant 12 mois (création avant juin 2026).
        </p>
      )}

      {/* Versement libératoire */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="vl-switch" className="text-sm font-medium cursor-pointer text-foreground/80">
            Versement libératoire IR
          </Label>
          <InfoTooltip text="Le versement libératoire permet de payer l'impôt sur le revenu en même temps que les cotisations sociales (taux fixe de 1 % à 2,2 % selon l'activité). Réservé aux foyers dont le revenu fiscal de référence N-2 ne dépasse pas 28 797 € par part." />
        </div>
        <Switch
          id="vl-switch"
          checked={hasVersementLiberatoire}
          onCheckedChange={onVersementChange}
        />
      </div>

      {!hasVersementLiberatoire && (
        <p
          className="text-xs text-muted-foreground leading-relaxed p-2.5 rounded-md"
          style={{ background: "oklch(0.78 0.17 65 / 8%)", borderLeft: "2px solid oklch(0.78 0.17 65 / 40%)" }}
        >
          Sans versement libératoire, l'IR est calculé séparément selon le barème progressif (après abattement forfaitaire).
        </p>
      )}
    </div>
  )
}
