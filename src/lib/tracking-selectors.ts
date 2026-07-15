import { createAnalyticsSettings } from "../analytics/analytics-settings";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import type { Habit, HabitLog } from "../types";

export function selectDayTracking(
  habits: Habit[],
  logs: HabitLog[],
  countMissingAsMissed: boolean,
  date: string,
  now = new Date(),
) {
  const analytics = createTrackerAnalytics(
    habits,
    logs,
    createAnalyticsSettings(
      { compterNonSaisisCommeManques: countMissingAsMissed },
      now,
    ),
    now,
  );
  return { score: analytics.dayScore(date).score, index: analytics.index };
}

export function selectMonthTracking(
  habits: Habit[],
  logs: HabitLog[],
  countMissingAsMissed: boolean,
  year: number,
  month: number,
  now = new Date(),
) {
  const analytics = createTrackerAnalytics(
    habits,
    logs,
    createAnalyticsSettings(
      {
        anneeActive: year,
        moisActif: month,
        compterNonSaisisCommeManques: countMissingAsMissed,
      },
      now,
    ),
    now,
  );
  return { scores: analytics.monthScores(year, month), index: analytics.index };
}
