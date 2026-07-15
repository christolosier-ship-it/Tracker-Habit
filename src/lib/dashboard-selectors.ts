import { monthShortLabels } from "../app/constants";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import type { AppData } from "../persistence";

export function selectDashboardStats(data: AppData, now = new Date()) {
  return createTrackerAnalytics(
    data.habits,
    data.logs,
    data.settings,
    now,
  ).dashboard(
    data.settings.anneeActive,
    data.settings.moisActif,
    monthShortLabels,
  );
}

export function selectMascotStats(data: AppData, now = new Date()) {
  return createTrackerAnalytics(
    data.habits,
    data.logs,
    data.settings,
    now,
  ).mascot();
}

export type DashboardStats = ReturnType<typeof selectDashboardStats>;
