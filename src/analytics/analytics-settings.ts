import type { UserSettings } from "../types";

export type AnalyticsPeriod = Pick<
  UserSettings,
  "anneeActive" | "moisActif" | "compterNonSaisisCommeManques"
>;

export function createAnalyticsSettings(
  period: Partial<AnalyticsPeriod>,
  now = new Date(),
): UserSettings {
  return {
    anneeActive: period.anneeActive ?? now.getFullYear(),
    moisActif: period.moisActif ?? now.getMonth(),
    compterNonSaisisCommeManques:
      period.compterNonSaisisCommeManques ?? false,
    themeId: "dopamine-pop",
    mascotEnabled: true,
  };
}
