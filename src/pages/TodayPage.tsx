import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { HabitStatusCard } from "../features/tracking/HabitStatusCard";
import { FilterToday } from "../app/constants";
import { TodayPageProps } from "./page-types";
import { readTrackerStatus } from "../analytics/tracker-index";
import { habitExistsOnDate } from "../domain/evaluation";

export function TodayPage({ data, analytics, today, cycle }: TodayPageProps) {
  const [filter, setFilter] = useState<FilterToday>("Quotidiennes");
  const now = new Date(`${today}T12:00:00`);
  const dateFr = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);
  const score = analytics.dayScore(today).score;
  const habits = data.habits.filter((habit) => {
    if (!habit.active || !habitExistsOnDate(habit, today)) return false;
    if (filter === "Quotidiennes") return habit.frequence === "quotidienne";
    if (filter === "Hebdomadaires") return habit.frequence === "hebdomadaire";
    return true;
  });

  return (
    <>
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
            {score === null ? "—" : `${score}%`}
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
            date={today}
            status={readTrackerStatus(analytics.index, habit.id, today)}
            cycle={cycle}
            key={habit.id}
          />
        ))}
      </section>
    </>
  );
}
