import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ACTIVITY_LABELS, ACTIVITY_EXAMPLES } from "@/lib/taxRates"
import type { ActivityType } from "@/types"

interface Props {
  value: ActivityType
  onChange: (value: ActivityType) => void
}

export function ActivitySelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="activity-select" className="text-sm font-medium text-foreground/80">
        Type d'activité
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as ActivityType)}>
        <SelectTrigger
          id="activity-select"
          className="w-full border-border/50 bg-input/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        >
          <SelectValue placeholder="Sélectionner votre activité" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border/60">
          {(Object.keys(ACTIVITY_LABELS) as ActivityType[]).map((type) => (
            <SelectItem key={type} value={type} className="focus:bg-primary/10 focus:text-foreground">
              <div className="flex flex-col gap-0.5 py-0.5">
                <span className="font-medium text-sm">{ACTIVITY_LABELS[type]}</span>
                <span className="text-xs text-muted-foreground">
                  {ACTIVITY_EXAMPLES[type]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
