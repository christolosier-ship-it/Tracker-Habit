import { Habit, HabitLog, UserSettings } from "../types";
import { createDemoLogs, defaultSettings, demoHabits } from "../data/demoData";
import { defaultThemeId, resolveTheme } from "../themes/theme-registry";
import {
  isHabitCategory,
  isHabitFrequency,
  isHabitPriority,
  isHabitStatus,
} from "../domain/definitions";
import { isValidIsoDate } from "./date-utils";

export const SCHEMA_VERSION = 5;
const KEY = "discipline-dashboard-v2";
const BACKUP_KEY = `${KEY}-backup`;

export type AppData = {
  schemaVersion: number;
  habits: Habit[];
  logs: HabitLog[];
  settings: UserSettings;
};

export const demoData = (): AppData => ({
  schemaVersion: SCHEMA_VERSION,
  habits: demoHabits,
  logs: createDemoLogs(),
  settings: defaultSettings,
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isHabit(value: unknown): value is Habit {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.nom === "string" &&
    isHabitCategory(value.categorie) &&
    isHabitFrequency(value.frequence) &&
    typeof value.objectif === "string" &&
    isHabitPriority(value.priorite) &&
    typeof value.active === "boolean" &&
    isValidIsoDate(value.dateCreation) &&
    (value.couleur === undefined || typeof value.couleur === "string")
  );
}

function isLog(value: unknown): value is HabitLog {
  if (!isRecord(value)) return false;
  return (
    typeof value.habitId === "string" &&
    isValidIsoDate(value.date) &&
    isHabitStatus(value.status)
  );
}

function isSettings(value: unknown): value is UserSettings {
  if (!isRecord(value)) return false;
  return (
    typeof value.anneeActive === "number" &&
    Number.isInteger(value.anneeActive) &&
    value.anneeActive >= 1970 &&
    value.anneeActive <= 2200 &&
    typeof value.moisActif === "number" &&
    Number.isInteger(value.moisActif) &&
    value.moisActif >= 0 &&
    value.moisActif <= 11 &&
    typeof value.compterNonSaisisCommeManques === "boolean" &&
    (value.themeId === undefined || typeof value.themeId === "string") &&
    (value.mascotEnabled === undefined ||
      typeof value.mascotEnabled === "boolean")
  );
}

export function validateImport(value: unknown): value is AppData {
  if (!isRecord(value)) return false;
  return (
    (value.schemaVersion === undefined ||
      (Number.isInteger(value.schemaVersion) &&
        Number(value.schemaVersion) >= 1 &&
        Number(value.schemaVersion) <= SCHEMA_VERSION)) &&
    Array.isArray(value.habits) &&
    value.habits.every(isHabit) &&
    Array.isArray(value.logs) &&
    value.logs.every(isLog) &&
    isSettings(value.settings)
  );
}

export function migrateData(data: AppData): AppData {
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
    settings: { ...defaultSettings, ...data.settings, themeId, mascotEnabled: data.settings.mascotEnabled ?? true },
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return demoData();
    const parsed: unknown = JSON.parse(raw);
    if (!validateImport(parsed)) throw new Error("Format invalide");
    return migrateData(parsed);
  } catch (error) {
    console.warn("Chargement local impossible, restauration de la démo.", error);
    const backup = localStorage.getItem(BACKUP_KEY);
    if (backup) {
      try {
        const parsed: unknown = JSON.parse(backup);
        if (validateImport(parsed)) return migrateData(parsed);
      } catch {
        // La sauvegarde de secours est également illisible.
      }
    }
    return demoData();
  }
}

export function saveData(data: AppData) {
  try {
    const current = localStorage.getItem(KEY);
    if (current) localStorage.setItem(BACKUP_KEY, current);
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Sauvegarde locale impossible.", error);
  }
}

export function resetData() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(BACKUP_KEY);
}
