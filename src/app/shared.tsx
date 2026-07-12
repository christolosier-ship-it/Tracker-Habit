import React from "react";
import { Check, Clock, Pause, X } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ThemedProgressRing } from "../components/charts/ThemedProgressRing";
import { AppTheme } from "../themes/theme-types";
import { AppData } from "../lib/storage";
import { DashboardStats } from "../lib/dashboard-selectors";
import { Habit, HabitStatus, UserSettings } from "../types";
import { monthLongLabels } from "./constants";
import * as S from "../lib/stats";

export type SetSettings = (patch: Partial<UserSettings>) => void;
export type CycleStatus = (habitId: string, date: string) => void;

type AppHeaderProps = {
  data: AppData;
  setSettings: SetSettings;
  /** Conservées temporairement pour ne pas imposer une migration brutale des pages. */
  theme?: AppTheme;
  stats?: DashboardStats;
  title?: string;
};

export function AppHeader({ data, setSettings }: AppHeaderProps) {
  return (
    <section className="hero-card period-controls" aria-label="Période active">
      <div className="hero-controls">
        <label>
          Année
          <input
            type="number"
            value={data.settings.anneeActive}
            onChange={(event) =>
              setSettings({ anneeActive: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Mois actif
          <select
            value={data.settings.moisActif}
            onChange={(event) =>
              setSettings({ moisActif: Number(event.target.value) })
            }
          >
            {monthLongLabels.map((label, index) => (
              <option value={index} key={label}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export function TremorPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="chart-card tremor-panel">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function StatusButton({
  status,
  onClick,
}: {
  status: HabitStatus;
  onClick: () => void;
}) {
  const Icon =
    status === "done"
      ? Check
      : status === "partial"
        ? Clock
        : status === "missed"
          ? X
          : status === "rest"
            ? Pause
            : Clock;

  return (
    <Button
      className={`status-button ${status}`}
      onClick={onClick}
      type="button"
      variant="status"
    >
      <Icon />
      {S.statusLabels[status]}
    </Button>
  );
}

export function HabitStatusCard({
  habit,
  date,
  data,
  cycle,
}: {
  habit: Habit;
  date: string;
  data: AppData;
  cycle: CycleStatus;
}) {
  const status = S.logFor(data.logs, habit.id, date);

  return (
    <Card className="habit-card">
      <div>
        <Badge
          variant={
            status === "done"
              ? "success"
              : status === "missed"
                ? "danger"
                : "default"
          }
        >
          {habit.categorie}
        </Badge>
        <h3>{habit.nom}</h3>
        <p>
          {habit.objectif} · {habit.frequence} · priorité {habit.priorite}
        </p>
      </div>
      <StatusButton status={status} onClick={() => cycle(habit.id, date)} />
    </Card>
  );
}

export function AntiProcrastination({
  theme,
  stats,
}: {
  theme: AppTheme;
  stats: DashboardStats;
}) {
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
