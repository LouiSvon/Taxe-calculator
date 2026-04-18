import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CA_PLAFONDS, ACTIVITY_LABELS } from "@/lib/taxRates"
import { formatEuros } from "@/lib/taxCalculator"
import type { ActivityType } from "@/types"

interface Props {
  ca: number
  activityType: ActivityType
  onChange: (ca: number) => void
}

export function CAInput({ ca, activityType, onChange }: Props) {
  const plafond = CA_PLAFONDS[activityType]
  const percent = Math.min((ca / plafond) * 100, 100)

  const getProgressColor = () => {
    if (percent < 70) return "oklch(0.72 0.17 155)"
    if (percent < 90) return "oklch(0.78 0.17 65)"
    return "oklch(0.68 0.2 22)"
  }

  const getStatusLabel = () => {
    if (ca === 0) return null
    if (percent < 70) return { text: "Zone sécurisée", color: "oklch(0.72 0.17 155)" }
    if (percent < 90) return { text: "Proche du plafond", color: "oklch(0.78 0.17 65)" }
    if (percent <= 100) return { text: "Plafond bientôt atteint", color: "oklch(0.68 0.2 22)" }
    return { text: "Plafond dépassé !", color: "oklch(0.68 0.2 22)" }
  }

  const status = getStatusLabel()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="ca-input" className="text-sm font-medium text-foreground/80">
          Chiffre d'affaires annuel (HT)
        </Label>
        {status && (
          <span
            className="text-[10px] font-medium tracking-wide shrink-0"
            style={{ color: status.color }}
          >
            {status.text}
          </span>
        )}
      </div>

      <div className="relative">
        <Input
          id="ca-input"
          type="number"
          min={0}
          max={999_999}
          step={100}
          value={ca || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Ex : 50 000"
          className="pr-8 text-lg font-semibold bg-input/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm pointer-events-none">
          €
        </span>
      </div>

      {ca > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground/60">
            <span>0 €</span>
            <span className="font-medium tabular-nums" style={{ color: getProgressColor() }}>
              {ca > plafond ? "Dépassement !" : `${Math.round(percent)} %`}
            </span>
            <span>{formatEuros(plafond)}</span>
          </div>
          <div className="relative h-1.5 w-full rounded-full overflow-hidden"
               style={{ background: "oklch(1 0 0 / 8%)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percent, 100)}%`,
                background: getProgressColor(),
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground/50">
            Plafond {ACTIVITY_LABELS[activityType].split(" (")[0]} :{" "}
            <strong className="text-muted-foreground/80">{formatEuros(plafond)}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
