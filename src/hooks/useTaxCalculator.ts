import { useState, useMemo } from "react"
import type { CalculatorState, Purchase } from "@/types"
import { calculateTaxes } from "@/lib/taxCalculator"

const INITIAL_STATE: CalculatorState = {
  ca: 0,
  activityType: "bnc_unregulated",
  frequency: "monthly",
  hasACRE: false,
  hasVersementLiberatoire: false,
  purchases: [],
  periodMonths: 1,
}

export function useTaxCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE)

  const breakdown = useMemo(
    () => calculateTaxes(state),
    [state]
  )

  const updateCA = (ca: number) => setState((s) => ({ ...s, ca }))

  const updateActivityType = (activityType: CalculatorState["activityType"]) =>
    setState((s) => ({ ...s, activityType }))

  const updateFrequency = (frequency: CalculatorState["frequency"]) =>
    setState((s) => ({ ...s, frequency }))

  const toggleACRE = (hasACRE: boolean) => setState((s) => ({ ...s, hasACRE }))

  const toggleVersementLiberatoire = (hasVersementLiberatoire: boolean) =>
    setState((s) => ({ ...s, hasVersementLiberatoire }))

  const updatePurchases = (purchases: Purchase[]) =>
    setState((s) => ({ ...s, purchases }))

  const reset = () => setState(INITIAL_STATE)

  return {
    state,
    breakdown,
    updateCA,
    updateActivityType,
    updateFrequency,
    toggleACRE,
    toggleVersementLiberatoire,
    updatePurchases,
    reset,
  }
}
