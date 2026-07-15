import {
  HABIT_STATUS_CYCLE,
  HABIT_STATUS_DEFINITIONS,
} from "../domain/definitions";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import { aggregateEvaluations } from "../domain/evaluation";
import type {
  CategoryStats,
  Habit,
  HabitLog,
  HabitStatus,
  StatusStats,
  UserSettings,
} from "../types";
import { monthShortLabels } from "../app/constants";
import { parseLocalIso, monthPrefix } from "./date-utils";

export const statusLabels = Object.fromEntries(
  HABIT_STATUS_CYCLE.map((status) => [
    status,
    HABIT_STATUS_DEFINITIONS[status].label,
  ]),
) as Record<HabitStatus, string>;

export const statusCycle = [...HABIT_STATUS_CYCLE];

export function getStatusScore(
  status: HabitStatus,
  countEmpty = false,
  past = false,
) {
  if (status === "empty" && countEmpty && past) return 0;
  return HABIT_STATUS_DEFINITIONS[status].score;
}

export function calculateDayScore(
  habits: Habit[],
  logs: HabitLog[],
  date: string,
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).dayScore(date).score;
}

export function calculateSuccessRate(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return aggregateEvaluations(
    createTrackerAnalytics(habits, logs, settings).evaluationsForYear(
      settings.anneeActive,
    ),
  ).successRate;
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

export function calculateHabitMonthScore(
  habit: Habit,
  logs: HabitLog[],
  year: number,
  month: number,
  settings: UserSettings,
) {
  return createTrackerAnalytics([habit], logs, settings).monthScore(
    year,
    month,
    new Set([habit.id]),
  );
}

export function calculateYearScore(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).yearScore(year);
}

export function calculateCurrentStreak(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).currentStreak();
}

export function calculateBestStreak(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).bestStreak(
    settings.anneeActive,
  );
}

export function calculateDisciplinedDays(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).disciplinedDays(year);
}

function dashboardFor(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).dashboard(
    settings.anneeActive,
    settings.moisActif,
    monthShortLabels,
  );
}

export function calculateHabitMonthlyRates(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  settings: UserSettings,
) {
  return createTrackerAnalytics(habits, logs, settings).dashboard(
    year,
    settings.moisActif,
    monthShortLabels,
  ).annualRates;
}

export function calculateCategoryStats(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
): CategoryStats[] {
  return dashboardFor(habits, logs, settings).categoryStats;
}

export function calculateStatusStats(
  logs: HabitLog[],
  habits?: Habit[],
  settings?: UserSettings,
  year = settings?.anneeActive,
): StatusStats[] {
  if (habits && settings && year !== undefined) {
    return createTrackerAnalytics(habits, logs, settings).dashboard(
      year,
      settings.moisActif,
      monthShortLabels,
    ).statusStats;
  }
  const counts = new Map<HabitStatus, number>(
    HABIT_STATUS_CYCLE.map((status) => [status, 0]),
  );
  for (const log of logs) {
    counts.set(log.status, (counts.get(log.status) ?? 0) + 1);
  }
  return HABIT_STATUS_CYCLE.map((status) => ({
    status,
    label: statusLabels[status],
    value: counts.get(status) ?? 0,
  }));
}

export function calculateTopHabits(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return dashboardFor(habits, logs, settings).topHabits;
}

export function calculateFragileHabits(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return dashboardFor(habits, logs, settings).fragileHabits;
}

export function calculateAntiProcrastinationIndex(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return dashboardFor(habits, logs, settings).anti;
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

export function hasTrackedDataForMonth(
  logs: HabitLog[],
  year: number,
  month: number,
) {
  return logs.some((log) => log.date.startsWith(monthPrefix(year, month)));
}

export function getDateForLog(log: HabitLog) {
  return parseLocalIso(log.date);
}
