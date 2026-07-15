import type { AnalyticsOptions } from "./domain/tracker-types";
import type { ThemeId } from "./themes/theme-ids";

export type {
  HabitCategory,
  HabitStatus,
} from "./domain/definitions";
export type {
  Habit,
  HabitLog,
} from "./domain/tracker-types";

type PeriodSettings = {
  anneeActive: number;
  moisActif: number;
};

type UiPreferences = {
  themeId: ThemeId;
  mascotEnabled: boolean;
};

export type UserSettings = PeriodSettings & AnalyticsOptions & UiPreferences;
