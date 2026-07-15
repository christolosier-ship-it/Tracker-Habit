import { defaultSettings } from "../data/demoData";
import { defaultThemeId, resolveTheme } from "../themes/theme-registry";
import type { Habit, HabitLog } from "../types";
import {
  SCHEMA_VERSION,
  type AppData,
  type ImportableAppData,
} from "./schema";

export function migrateData(data: ImportableAppData): AppData {
  const themeId = resolveTheme(data.settings.themeId).id ?? defaultThemeId;
  const uniqueHabits = new Map<string, Habit>();
  for (const habit of data.habits) {
    if (!uniqueHabits.has(habit.id)) uniqueHabits.set(habit.id, habit);
  }

  const habits = [...uniqueHabits.values()];
  const knownHabitIds = new Set(habits.map((habit) => habit.id));
  const deduplicatedLogs = new Map<string, HabitLog>();
  for (const log of data.logs) {
    if (!knownHabitIds.has(log.habitId) || log.status === "empty") continue;
    deduplicatedLogs.set(`${log.habitId}|${log.date}`, log);
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    habits,
    logs: [...deduplicatedLogs.values()],
    settings: {
      ...defaultSettings,
      ...data.settings,
      themeId,
      mascotEnabled: data.settings.mascotEnabled ?? true,
    },
  };
}
