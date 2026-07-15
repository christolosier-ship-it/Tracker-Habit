import { useMemo } from "react";
import type { TrackerAnalytics } from "../analytics/tracker-analytics";
import { monthShortLabels } from "../app/constants";

export function useDashboardStats(
  analytics: TrackerAnalytics,
  year: number,
  month: number,
) {
  return useMemo(
    () => analytics.dashboard(year, month, monthShortLabels),
    [analytics, month, year],
  );
}
