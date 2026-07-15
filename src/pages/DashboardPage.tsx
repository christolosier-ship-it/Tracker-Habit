import { BentoShell } from "../components/effects/premium-effects";
import { ThemedAreaChart } from "../components/charts/ThemedAreaChart";
import { ThemedBarChart } from "../components/charts/ThemedBarChart";
import { ThemedBarList } from "../components/charts/ThemedBarList";
import { ThemedDonutChart } from "../components/charts/ThemedDonutChart";
import { PeriodControls } from "../features/period/PeriodControls";
import { ChartPanel } from "../features/analytics/ChartPanel";
import { AntiProcrastinationPanel } from "../features/analytics/AntiProcrastinationPanel";
import { AnnualHabitMatrix } from "../features/dashboard/AnnualHabitMatrix";
import { KpiRail } from "../features/dashboard/KpiRail";
import { formatPercent } from "../app/constants";
import { DashboardPageProps } from "./page-types";
import { useDashboardStats } from "../hooks/useDashboardStats";

export function DashboardPage({
  data,
  theme,
  analytics,
  setSettings,
}: DashboardPageProps) {
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
      <KpiRail theme={theme} stats={stats} />
      <BentoShell className="dashboard-layout">
        <AnnualHabitMatrix theme={theme} rates={stats.annualRates} />
        <div className="dashboard-side">
          <ChartPanel
            title="Progression mensuelle"
            description="Score global par mois"
          >
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
            title="Statuts"
            description="Accompli, partiel, manqué, repos"
          >
            <ThemedDonutChart
              theme={theme}
              variant="status"
              data={stats.statusStats}
              valueFormatter={(value: number) => `${value}`}
            />
          </ChartPanel>
        </div>
      </BentoShell>
      <section className="chart-grid">
        <ChartPanel title="Score par mois" description="Vue histogramme">
          <ThemedBarChart
            theme={theme}
            data={stats.monthly}
            index="mois"
            categories={["score"]}
            variant="score"
            valueFormatter={formatPercent}
          />
        </ChartPanel>
        <ChartPanel
          title="Répartition par catégorie"
          description="Volume d’opportunités évaluées"
        >
          <ThemedDonutChart
            theme={theme}
            variant="category"
            data={stats.categoryStats}
            valueFormatter={(value: number) => `${value}`}
          />
        </ChartPanel>
        <ChartPanel
          title="Top 10 habitudes"
          description="Les habitudes qui tiennent le mieux"
        >
          <ThemedBarList
            theme={theme}
            data={stats.topHabits.map((habit) => ({
              name: habit.nom,
              value: habit.score,
            }))}
            variant="topHabits"
            valueFormatter={formatPercent}
          />
        </ChartPanel>
        <ChartPanel
          title="Habitudes fragiles"
          description="À reprendre sans drame, mais sans brouillard"
        >
          <ThemedBarList
            theme={theme}
            data={stats.fragileHabits.map((habit) => ({
              name: habit.nom,
              value: habit.score,
            }))}
            variant="fragile"
            valueFormatter={formatPercent}
          />
        </ChartPanel>
      </section>
      <AntiProcrastinationPanel theme={theme} stats={stats} />
    </>
  );
}
