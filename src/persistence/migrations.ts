import { createDefaultSettings } from "../data/demoData";
import { habitExistsOnDate } from "../domain/evaluation";
import type { Habit, HabitLog } from "../domain/tracker-types";
import { defaultThemeId, resolveTheme } from "../themes/theme-registry";
import {
  SCHEMA_VERSION,
  type AppData,
  type ImportableAppData,
} from "./schema";

function latestHabitLogDate(habitId: string, logs: HabitLog[]) {
  let latest: string | undefined;
  for (const log of logs) {
    if (log.habitId === habitId && (!latest || log.date > latest)) latest = log.date;
  }
  return latest;
}

function normalizeHabit(habit: Habit, logs: HabitLog[]): Habit {
  const normalized: Habit = {
    id: habit.id,
    nom: habit.nom,
    categorie: habit.categorie,
    frequence: habit.frequence,
    objectif: habit.objectif,
    priorite: habit.priorite,
    active: habit.active,
    dateCreation: habit.dateCreation,
  };
  if (!habit.active) {
    normalized.archivedAt =
      habit.archivedAt ?? latestHabitLogDate(habit.id, logs) ?? habit.dateCreation;
  }
  if (habit.inactiveRanges?.length) {
    normalized.inactiveRanges = habit.inactiveRanges.map((range) => ({
      start: range.start,
      end: range.end,
    }));
  }
  return normalized;
}

export function migrateData(data: ImportableAppData): AppData {
  const themeId = resolveTheme(data.settings.themeId).id ?? defaultThemeId;
  const uniqueHabits = new Map<string, Habit>();
  for (const rawHabit of data.habits) {
    if (!uniqueHabits.has(rawHabit.id)) {
      uniqueHabits.set(rawHabit.id, normalizeHabit(rawHabit, data.logs));
    }
  }

  const habits = [...uniqueHabits.values()];
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));
  const deduplicatedLogs = new Map<string, HabitLog>();
  for (const log of data.logs) {
    const habit = habitById.get(log.habitId);
    if (
      !habit ||
      log.status === "empty" ||
      !habitExistsOnDate(habit, log.date)
    ) continue;
    deduplicatedLogs.set(`${log.habitId}|${log.date}`, log);
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    habits,
    logs: [...deduplicatedLogs.values()],
    settings: {
      ...createDefaultSettings(),
      ...data.settings,
      themeId,
      mascotEnabled: data.settings.mascotEnabled ?? true,
    },
  };
}
