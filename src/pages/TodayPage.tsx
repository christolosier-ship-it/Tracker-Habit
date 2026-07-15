import { useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { HabitStatusCard } from "../features/tracking/HabitStatusCard";
import { PeriodControls } from "../features/period/PeriodControls";
import { FilterToday } from "../app/constants";
import { formatLocalIso } from "../lib/date-utils";
import { TodayPageProps } from "./page-types";
import { selectDayTracking } from "../lib/tracking-selectors";
import { readTrackerStatus } from "../analytics/tracker-index";

export function TodayPage({ data, setSettings, cycle }: TodayPageProps) {
  const [filter, setFilter] = useState<FilterToday>("Quotidiennes");
  const now = new Date();
  const date = formatLocalIso(now);
  const dateFr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const tracking = useMemo(
    () =>
      selectDayTracking(
        data.habits,
        data.logs,
        data.settings.compterNonSaisisCommeManques,
        date,
      ),
    [
      data.habits,
      data.logs,
      data.settings.compterNonSaisisCommeManques,
      date,
    ],
  );
  const habits = data.habits.filter((habit) => {
    if (!habit.active) return false;
    if (filter === "Quotidiennes") return habit.frequence === "quotidienne";
    if (filter === "Hebdomadaires") return habit.frequence === "hebdomadaire";
    return true;
  });

  return (
    <>
      <PeriodControls
        year={data.settings.anneeActive}
        month={data.settings.moisActif}
        onYearChange={(year) => setSettings({ anneeActive: year })}
        onMonthChange={(month) => setSettings({ moisActif: month })}
      />
      <Card className="today-summary">
        <div>
          <p className="eyebrow compact">Saisie rapide</p>
          <h2>{dateFr}</h2>
          <p>
            Un clic fait tourner le statut : non saisi → accompli → partiel →
            manqué → repos.
          </p>
        </div>
        <div className="today-score">
          <span>Score du jour</span>
          <strong>
            {tracking.score}%
          </strong>
        </div>
      </Card>
      <div className="filter-row">
        {(["Quotidiennes", "Hebdomadaires", "Toutes"] as const).map(
          (label) => (
            <Button
              variant={filter === label ? "default" : "secondary"}
              onClick={() => setFilter(label)}
              key={label}
              type="button"
            >
              {label}
            </Button>
          ),
        )}
      </div>
      <section className="habit-card-grid">
        {habits.map((habit) => (
          <HabitStatusCard
            habit={habit}
            date={date}
            status={readTrackerStatus(tracking.index, habit.id, date)}
            cycle={cycle}
            key={habit.id}
          />
        ))}
      </section>
    </>
  );
}
