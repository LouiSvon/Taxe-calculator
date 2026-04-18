import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, Plus, ShoppingBag } from "lucide-react"
import { TVA_RATES_LABELS } from "@/lib/taxRates"
import { formatEuros } from "@/lib/taxCalculator"
import type { Purchase, TVARate } from "@/types"

interface Props {
  purchases: Purchase[]
  isSoumiseTVA: boolean
  onChange: (purchases: Purchase[]) => void
}

const EMPTY_PURCHASE = { description: "", amountHT: 0, tvaRate: 20 as TVARate }

export function PurchasesList({ purchases, isSoumiseTVA, onChange }: Props) {
  const [newItem, setNewItem] = useState(EMPTY_PURCHASE)

  const totalHT = purchases.reduce((s, p) => s + p.amountHT, 0)
  const totalTVA = purchases.reduce((s, p) => s + p.amountHT * (p.tvaRate / 100), 0)
  const totalTTC = totalHT + totalTVA

  const addPurchase = () => {
    if (!newItem.description.trim() || newItem.amountHT <= 0) return
    const purchase: Purchase = {
      id: crypto.randomUUID(),
      ...newItem,
    }
    onChange([...purchases, purchase])
    setNewItem(EMPTY_PURCHASE)
  }

  const removePurchase = (id: string) => {
    onChange(purchases.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Achats professionnels</Label>
        </div>
        {purchases.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {purchases.length} achat{purchases.length > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {!isSoumiseTVA && (
        <p className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2.5">
          En franchise de TVA, vous ne pouvez pas récupérer la TVA sur vos achats.
          Ces informations sont conservées pour suivi de vos dépenses.
        </p>
      )}

      {/* Formulaire d'ajout */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Input
            placeholder="Ex : Matériel informatique"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === "Enter" && addPurchase()}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Montant HT (€)</Label>
          <Input
            type="number"
            min={0}
            step={0.01}
            placeholder="0"
            value={newItem.amountHT || ""}
            onChange={(e) =>
              setNewItem({ ...newItem, amountHT: Number(e.target.value) })
            }
            className="h-8 text-sm w-28"
            onKeyDown={(e) => e.key === "Enter" && addPurchase()}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">TVA</Label>
          <Select
            value={String(newItem.tvaRate)}
            onValueChange={(v) =>
              setNewItem({ ...newItem, tvaRate: Number(v) as TVARate })
            }
          >
            <SelectTrigger className="h-8 text-sm w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TVA_RATES_LABELS).map(([rate]) => (
                <SelectItem key={rate} value={rate}>
                  {rate}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          onClick={addPurchase}
          disabled={!newItem.description.trim() || newItem.amountHT <= 0}
          className="h-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Liste des achats */}
      {purchases.length > 0 && (
        <div className="space-y-1.5">
          {purchases.map((p) => {
            const tva = p.amountHT * (p.tvaRate / 100)
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-sm"
              >
                <span className="flex-1 truncate font-medium">{p.description}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <span>{formatEuros(p.amountHT)} HT</span>
                  {p.tvaRate > 0 && (
                    <span className="text-blue-600 dark:text-blue-400">
                      TVA {p.tvaRate}% : {formatEuros(tva)}
                    </span>
                  )}
                  <span className="font-medium text-foreground">
                    {formatEuros(p.amountHT + tva)} TTC
                  </span>
                </div>
                <button
                  onClick={() => removePurchase(p.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}

          {/* Totaux */}
          <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm font-medium">
            <span>Total dépenses</span>
            <div className="flex gap-4 text-xs">
              <span>{formatEuros(totalHT)} HT</span>
              {isSoumiseTVA && (
                <span className="text-blue-600 dark:text-blue-400">
                  TVA récupérable : {formatEuros(totalTVA)}
                </span>
              )}
              <span>{formatEuros(totalTTC)} TTC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
