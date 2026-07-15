import { monthShortLabels } from "../app/constants";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import type { AppData } from "../persistence";
import type { Habit, HabitLog } from "../types";
import {
  createAnalyticsSettings,
  type AnalyticsPeriod,
} from "../analytics/analytics-settings";

export function selectDashboardStatsForPeriod(
  habits: Habit[],
  logs: HabitLog[],
  period: AnalyticsPeriod,
  now = new Date(),
) {
  return createTrackerAnalytics(
    habits,
    logs,
    createAnalyticsSettings(period, now),
    now,
  ).dashboard(period.anneeActive, period.moisActif, monthShortLabels);
}

export function selectDashboardStats(data: AppData, now = new Date()) {
  return selectDashboardStatsForPeriod(
    data.habits,
    data.logs,
    data.settings,
    now,
  );
}

export function selectMascotStats(
  habits: Habit[],
  logs: HabitLog[],
  countMissingAsMissed: boolean,
  now = new Date(),
) {
  return createTrackerAnalytics(
    habits,
    logs,
    createAnalyticsSettings({
      anneeActive: now.getFullYear(),
      moisActif: now.getMonth(),
      compterNonSaisisCommeManques: countMissingAsMissed,
    }, now),
    now,
  ).mascot();
}

export type DashboardStats = ReturnType<typeof selectDashboardStats>;
