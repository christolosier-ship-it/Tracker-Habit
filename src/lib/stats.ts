import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import { monthShortLabels } from "../app/constants";
import type { Habit, HabitLog, UserSettings } from "../types";

export function calculateDayScore(
  habits: Habit[],
  logs: HabitLog[],
  date: string,
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).dayScore(date).score;
}

export function calculateMonthScore(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  month: number,
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).monthScore(year, month);
}

export function calculateCurrentStreak(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).currentStreak();
}

export function calculateFragileHabits(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).dashboard(
    settings.anneeActive,
    settings.moisActif,
    monthShortLabels,
  ).fragileHabits;
}

export function calculatePriorityDoneDays(habits: Habit[], logs: HabitLog[]) {
  const priorityIds = new Set(
    habits
      .filter(
        (habit) =>
          habit.active &&
          (habit.priorite === "haute" ||
            ["Productivité", "Anti-procrastination"].includes(
              habit.categorie,
            ) ||
            /prioritaire|deep work|pénible|repoussé/i.test(habit.nom)),
      )
      .map((habit) => habit.id),
  );
  return new Set(
    logs
      .filter((log) => priorityIds.has(log.habitId) && log.status === "done")
      .map((log) => log.date),
  ).size;
}
