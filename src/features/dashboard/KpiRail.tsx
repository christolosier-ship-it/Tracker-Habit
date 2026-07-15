import {
  CalendarDays,
  Check,
  Clock,
  Eye,
  Flame,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { ThemedProgressRing } from "../../components/charts/ThemedProgressRing";
import { SpotlightCard } from "../../components/effects/premium-effects";
import { ThemeKpiFrame } from "../../components/theme-identity/ThemeKpiFrame";
import type { DashboardAnalytics } from "../../analytics/tracker-analytics";
import { AppTheme } from "../../themes/theme-types";

type KpiRailProps = {
  theme: AppTheme;
  stats: DashboardAnalytics;
};

export function KpiRail({ theme, stats }: KpiRailProps) {
  const kpis = [
    { label: "Score global", value: stats.scoreGlobal, suffix: "%", icon: TrendingUp, gauge: true },
    { label: "Score du mois", value: stats.currentMonth, suffix: "%", icon: CalendarDays, gauge: true },
    { label: "Taux de réussite", value: stats.success, suffix: "%", icon: Target, gauge: true },
    { label: "Anti-procrastination", value: stats.anti, suffix: "%", icon: Flame, gauge: true },
    { label: "Jours disciplinés", value: stats.disciplinedDays, suffix: "", icon: Check },
    { label: "Série actuelle", value: stats.currentStreak, suffix: " j", icon: Clock },
    { label: "Habitudes complétées", value: stats.doneLogs, suffix: "", icon: Plus },
    { label: "Habitudes actives", value: stats.activeHabits, suffix: "", icon: Eye },
  ];

  return (
    <section className="kpi-grid" aria-label="Indicateurs clés">
      {kpis.map(({ label, value, suffix, icon: Icon, gauge }) => (
        <SpotlightCard className="kpi-card" key={label}>
          <ThemeKpiFrame>
            <div className="kpi-content">
              <div className="kpi-icon">
                <Icon />
              </div>
              <span>{label}</span>
              <strong>{value === null ? "—" : `${value}${suffix}`}</strong>
            </div>
            {gauge && (
              <ThemedProgressRing
                theme={theme}
                value={value}
                variant="score"
                label={label}
              />
            )}
          </ThemeKpiFrame>
        </SpotlightCard>
      ))}
    </section>
  );
}
