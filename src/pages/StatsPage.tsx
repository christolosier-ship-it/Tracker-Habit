import { ThemedAreaChart } from "../components/charts/ThemedAreaChart";
import { StatsInsightCards } from "../components/stats/StatsInsightCards";
import { ThemedCategoryScoreBars } from "../components/stats/ThemedCategoryScoreBars";
import { ThemedMonthlyRibbon } from "../components/stats/ThemedMonthlyRibbon";
import { ThemedStatusBreakdown } from "../components/stats/ThemedStatusBreakdown";
import { ChartPanel } from "../features/analytics/ChartPanel";
import { AntiProcrastinationPanel } from "../features/analytics/AntiProcrastinationPanel";
import { PeriodControls } from "../features/period/PeriodControls";
import { formatPercent } from "../app/constants";
import { StatsPageProps } from "./page-types";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function StatsPage({
  data,
  theme,
  analytics,
  setSettings,
}: StatsPageProps) {
  const stats = useDashboardStats(
    analytics,
    data.settings.anneeActive,
    data.settings.moisActif,
  );
  return (
    <>
      <PeriodControls
        year={data.settings.anneeActive}
        month={data.settings.moisActif}
        onYearChange={(year) => setSettings({ anneeActive: year })}
        onMonthChange={(month) => setSettings({ moisActif: month })}
      />
      <StatsInsightCards
        theme={theme}
        monthly={stats.monthly}
        categoryStats={stats.categoryStats}
      />
      <ThemedMonthlyRibbon theme={theme} monthly={stats.monthly} />
      <section className="chart-grid stats-grid">
        <ChartPanel title="Évolution du score" description="Mois par mois">
          <ThemedAreaChart
            theme={theme}
            data={stats.monthly}
            index="mois"
            categories={["score"]}
            variant="score"
            valueFormatter={formatPercent}
          />
        </ChartPanel>
        <ChartPanel
          title="Évolution anti-procrastination"
          description="Productivité + anti-report"
        >
          <ThemedAreaChart
            theme={theme}
            data={stats.antiMonthly}
            index="mois"
            categories={["anti"]}
            variant="antiProcrastination"
            valueFormatter={formatPercent}
          />
        </ChartPanel>
        <ChartPanel
          title="Score par catégorie"
          description="Performance par famille d’habitudes"
        >
          <ThemedCategoryScoreBars theme={theme} data={stats.categoryStats} />
        </ChartPanel>
        <ChartPanel
          title="Statuts enregistrés"
          description="Répartition des statuts saisis"
        >
          <ThemedStatusBreakdown theme={theme} data={stats.statusStats} />
        </ChartPanel>
      </section>
      <AntiProcrastinationPanel theme={theme} stats={stats} />
    </>
  );
}
