import { TooltipProvider } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, RotateCcw, Settings, ShoppingBag, BarChart3 } from "lucide-react"
import { ActivitySelector } from "@/components/ActivitySelector"
import { CAInput } from "@/components/CAInput"
import { OptionsPanel } from "@/components/OptionsPanel"
import { PurchasesList } from "@/components/PurchasesList"
import { TaxResults } from "@/components/TaxResults"
import { TaxSummaryTable } from "@/components/TaxSummaryTable"
import { useTaxCalculator } from "@/hooks/useTaxCalculator"

export default function App() {
  const {
    state,
    breakdown,
    updateCA,
    updateActivityType,
    updateFrequency,
    toggleACRE,
    toggleVersementLiberatoire,
    updatePurchases,
    reset,
  } = useTaxCalculator()

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* ── Header ──────────────────────────────────────────── */}
          <header className="mb-10 sm:mb-14 relative overflow-hidden">
            {/* Decorative background € */}
            <div
              className="absolute -top-8 right-0 leading-none pointer-events-none select-none opacity-[0.035] font-display"
              style={{
                fontSize: "clamp(8rem, 20vw, 16rem)",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "italic",
                color: "oklch(0.80 0.15 82)",
              }}
              aria-hidden
            >
              €
            </div>

            <div className="relative animate-fade-up">
              {/* Eyebrow */}
              <p
                className="text-[11px] tracking-[0.3em] uppercase mb-4 font-medium"
                style={{ color: "oklch(0.80 0.15 82 / 75%)" }}
              >
                Fiscalité 2025 · Auto-Entrepreneur
              </p>

              {/* Title */}
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <h1
                    className="font-display text-5xl sm:text-6xl font-semibold leading-[1.05] tracking-tight"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Calculateur
                    <br />
                    <em style={{ color: "oklch(0.80 0.15 82)" }}>fiscal</em>
                  </h1>
                  {/* Gold rule */}
                  <div
                    className="mt-4 mb-4 h-px w-14"
                    style={{ background: "oklch(0.80 0.15 82)" }}
                  />
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    Simulez vos charges sociales et fiscales selon les taux officiels URSSAF&nbsp;/ impôts.gouv.fr.
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 self-start mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/40 text-primary/80 hidden sm:flex"
                  >
                    Taux 2025
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className="text-muted-foreground hover:text-foreground text-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Réinitialiser
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-5">

            {/* ── Colonne gauche : paramètres ──────────────────── */}
            <div className="space-y-4">

              {/* Situation */}
              <Card className="animate-fade-up stagger-1 border-border/60">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                    <Calculator className="h-3.5 w-3.5 text-primary" />
                    Votre situation
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    Activité et chiffre d'affaires annuel prévisionnel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-5">
                  <ActivitySelector
                    value={state.activityType}
                    onChange={updateActivityType}
                  />
                  <Separator className="opacity-50" />
                  <CAInput
                    ca={state.ca}
                    activityType={state.activityType}
                    onChange={updateCA}
                  />
                </CardContent>
              </Card>

              {/* Options */}
              <Card className="animate-fade-up stagger-2 border-border/60">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                    <Settings className="h-3.5 w-3.5 text-primary" />
                    Options fiscales
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <OptionsPanel
                    hasACRE={state.hasACRE}
                    onACREChange={toggleACRE}
                    hasVersementLiberatoire={state.hasVersementLiberatoire}
                    onVersementChange={toggleVersementLiberatoire}
                    frequency={state.frequency}
                    onFrequencyChange={updateFrequency}
                  />
                </CardContent>
              </Card>

              {/* Dépenses */}
              <Card className="animate-fade-up stagger-3 border-border/60">
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground/90">
                    <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                    Dépenses professionnelles
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    TVA déductible si vous êtes assujetti.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <PurchasesList
                    purchases={state.purchases}
                    isSoumiseTVA={breakdown.isSoumiseTVA}
                    onChange={updatePurchases}
                  />
                </CardContent>
              </Card>
            </div>

            {/* ── Colonne droite : résultats ───────────────────── */}
            <div className="animate-fade-up stagger-2">
              <Tabs defaultValue="results" className="w-full">
                <TabsList className="w-full mb-5 bg-secondary/50 border border-border/40">
                  <TabsTrigger
                    value="results"
                    className="flex-1 gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    Résultats
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="flex-1 gap-1.5 text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    Tableau récap
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="mt-0">
                  <TaxResults
                    breakdown={breakdown}
                    frequency={state.frequency}
                    ca={state.ca}
                  />
                </TabsContent>

                <TabsContent value="table" className="mt-0">
                  <TaxSummaryTable breakdown={breakdown} ca={state.ca} />
                </TabsContent>
              </Tabs>

              {state.ca > 0 && (
                <p className="mt-5 text-xs text-muted-foreground/60 text-center px-4 leading-relaxed">
                  Calculs indicatifs basés sur les taux officiels 2025 (URSSAF, impôts.gouv.fr).
                  Pour votre situation précise, consultez un expert-comptable.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
