import { ThemedProgressRing } from "../../components/charts/ThemedProgressRing";
import type { DashboardAnalytics } from "../../analytics/tracker-analytics";
import { AppTheme } from "../../themes/theme-types";

type AntiProcrastinationPanelProps = {
  theme: AppTheme;
  stats: DashboardAnalytics;
};

export function AntiProcrastinationPanel({
  theme,
  stats,
}: AntiProcrastinationPanelProps) {
  const top = stats.antiTopHabit;
  const fragile = stats.antiFragileHabit;

  return (
    <section className="anti-panel">
      <div>
        <p className="eyebrow compact">Bloc spécial</p>
        <h2>Indice anti-procrastination</h2>
        <p>
          Un score concentré sur la tâche prioritaire, le deep work, le zéro
          scrolling et les habitudes qui évitent le report chronique.
        </p>
      </div>
      <ThemedProgressRing
        theme={theme}
        value={stats.anti}
        variant="antiProcrastination"
        size="lg"
        label="Indice anti-procrastination"
      />
      <ul>
        <li>Meilleure habitude productivité : {top?.nom ?? "à construire"}</li>
        <li>Habitude à reprendre : {fragile?.nom ?? "aucune alerte"}</li>
        <li>Jours avec tâche prioritaire accomplie : {stats.priorityDays}</li>
      </ul>
    </section>
  );
}
