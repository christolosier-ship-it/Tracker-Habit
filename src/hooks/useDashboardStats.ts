import { useMemo } from "react";
import { selectDashboardStatsForPeriod } from "../lib/dashboard-selectors";
import type { AppData } from "../persistence";

export function useDashboardStats(data: AppData) {
  return useMemo(
    () =>
      selectDashboardStatsForPeriod(data.habits, data.logs, {
        anneeActive: data.settings.anneeActive,
        moisActif: data.settings.moisActif,
        compterNonSaisisCommeManques:
          data.settings.compterNonSaisisCommeManques,
      }),
    [
      data.habits,
      data.logs,
      data.settings.anneeActive,
      data.settings.moisActif,
      data.settings.compterNonSaisisCommeManques,
    ],
  );
}
