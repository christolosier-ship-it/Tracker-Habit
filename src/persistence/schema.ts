import {
  isHabitCategory,
  isHabitFrequency,
  isHabitPriority,
  isHabitStatus,
} from "../domain/definitions";
import { isValidIsoDate } from "../lib/date-utils";
import type { Habit, HabitLog, UserSettings } from "../types";

export const SCHEMA_VERSION = 5;
export const STORAGE_KEY = "discipline-dashboard-v2";
export const BACKUP_STORAGE_KEY = `${STORAGE_KEY}-backup`;

export type AppData = {
  schemaVersion: number;
  habits: Habit[];
  logs: HabitLog[];
  settings: UserSettings;
};

export type ImportableAppData = {
  schemaVersion?: number;
  habits: Habit[];
  logs: HabitLog[];
  settings: Omit<UserSettings, "themeId" | "mascotEnabled"> & {
    themeId?: string;
    mascotEnabled?: boolean;
  };
};

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

function isSettings(
  value: unknown,
): value is ImportableAppData["settings"] {
  if (!isRecord(value)) return false;
  return (
    Number.isInteger(value.anneeActive) &&
    Number(value.anneeActive) >= 1970 &&
    Number(value.anneeActive) <= 2200 &&
    Number.isInteger(value.moisActif) &&
    Number(value.moisActif) >= 0 &&
    Number(value.moisActif) <= 11 &&
    typeof value.compterNonSaisisCommeManques === "boolean" &&
    (value.themeId === undefined || typeof value.themeId === "string") &&
    (value.mascotEnabled === undefined ||
      typeof value.mascotEnabled === "boolean")
  );
}

export function validateImport(value: unknown): value is ImportableAppData {
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
