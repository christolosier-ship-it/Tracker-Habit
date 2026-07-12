import { ThemedProgressRing } from "../../components/charts/ThemedProgressRing";
import { DashboardStats } from "../../lib/dashboard-selectors";
import { AppTheme } from "../../themes/theme-types";

type AntiProcrastinationPanelProps = {
  theme: AppTheme;
  stats: DashboardStats;
};

export function AntiProcrastinationPanel({
  theme,
  stats,
}: AntiProcrastinationPanelProps) {
  const top = stats.topHabits.find((habit) =>
    /deep|prioritaire|projet|inbox|admin/i.test(habit.nom),
  );
  const fragile = stats.fragileHabits[0];

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
