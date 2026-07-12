import { Habit, HabitLog, UserSettings } from "../types";
import { createDemoLogs, defaultSettings, demoHabits } from "../data/demoData";
import { defaultThemeId, resolveTheme } from "../themes/theme-registry";

export const SCHEMA_VERSION = 3;
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
    typeof value.categorie === "string" &&
    ["quotidienne", "hebdomadaire"].includes(String(value.frequence)) &&
    typeof value.objectif === "string" &&
    ["faible", "normale", "haute"].includes(String(value.priorite)) &&
    typeof value.active === "boolean" &&
    typeof value.dateCreation === "string"
  );
}

function isLog(value: unknown): value is HabitLog {
  if (!isRecord(value)) return false;
  return (
    typeof value.habitId === "string" &&
    typeof value.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    typeof value.status === "string" &&
    ["empty", "done", "partial", "missed", "rest"].includes(value.status)
  );
}

function isSettings(value: unknown): value is UserSettings {
  if (!isRecord(value)) return false;
  return (
    typeof value.anneeActive === "number" &&
    Number.isFinite(value.anneeActive) &&
    typeof value.moisActif === "number" &&
    Number.isInteger(value.moisActif) &&
    value.moisActif >= 0 &&
    value.moisActif <= 11 &&
    typeof value.compterNonSaisisCommeManques === "boolean"
  );
}

export function validateImport(value: unknown): value is AppData {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.habits) &&
    value.habits.every(isHabit) &&
    Array.isArray(value.logs) &&
    value.logs.every(isLog) &&
    isSettings(value.settings)
  );
}

export function migrateData(data: AppData): AppData {
  const themeId = resolveTheme(data.settings.themeId).id ?? defaultThemeId;
  const knownHabitIds = new Set(data.habits.map((habit) => habit.id));
  const deduplicatedLogs = new Map<string, HabitLog>();
  for (const log of data.logs) {
    if (!knownHabitIds.has(log.habitId) || log.status === "empty") continue;
    deduplicatedLogs.set(`${log.habitId}|${log.date}`, log);
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    habits: data.habits,
    logs: [...deduplicatedLogs.values()],
    settings: { ...defaultSettings, ...data.settings, themeId },
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
