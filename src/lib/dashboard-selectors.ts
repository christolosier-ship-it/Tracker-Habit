import { monthShortLabels } from "../app/constants";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import type { AppData } from "../persistence";
import type { Habit, HabitLog, UserSettings } from "../types";

type DashboardPeriod = Pick<
  UserSettings,
  "anneeActive" | "moisActif" | "compterNonSaisisCommeManques"
>;

function analyticsSettings(period: DashboardPeriod): UserSettings {
  return {
    ...period,
    themeId: "dopamine-pop",
    mascotEnabled: true,
  };
}

export function selectDashboardStatsForPeriod(
  habits: Habit[],
  logs: HabitLog[],
  period: DashboardPeriod,
  now = new Date(),
) {
  return createTrackerAnalytics(
    habits,
    logs,
    analyticsSettings(period),
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
    analyticsSettings({
      anneeActive: now.getFullYear(),
      moisActif: now.getMonth(),
      compterNonSaisisCommeManques: countMissingAsMissed,
    }),
    now,
  ).mascot();
}

export type DashboardStats = ReturnType<typeof selectDashboardStats>;
