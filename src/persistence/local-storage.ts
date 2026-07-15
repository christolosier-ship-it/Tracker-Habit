import {
  createDefaultSettings,
  createDemoHabits,
  createDemoLogs,
} from "../data/demoData";
import { migrateData } from "./migrations";
import {
  BACKUP_STORAGE_KEY,
  SCHEMA_VERSION,
  STORAGE_KEY,
  type AppData,
  validateImport,
} from "./schema";

export const demoData = (): AppData => {
  const now = new Date();
  const habits = createDemoHabits(now);
  return {
    schemaVersion: SCHEMA_VERSION,
    habits,
    logs: createDemoLogs(now, habits),
    settings: createDefaultSettings(now),
  };
};

function readStoredData(key: string) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  if (!validateImport(parsed)) return null;
  const migrated = migrateData(parsed);
  const normalized = JSON.stringify(migrated);
  if (key === STORAGE_KEY && normalized !== raw) {
    localStorage.setItem(BACKUP_STORAGE_KEY, raw);
    localStorage.setItem(STORAGE_KEY, normalized);
  }
  return migrated;
}

export function loadData(): AppData {
  try {
    const stored = readStoredData(STORAGE_KEY);
    if (stored) return stored;
    if (localStorage.getItem(STORAGE_KEY)) throw new Error("Format invalide");
    return demoData();
  } catch (error) {
    console.warn("Chargement local impossible, restauration de la démo.", error);
    try {
      const backup = readStoredData(BACKUP_STORAGE_KEY);
      if (!backup) return demoData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
      return backup;
    } catch {
      return demoData();
    }
  }
}

export function saveData(data: AppData) {
  try {
    const serialized = JSON.stringify(data);
    const current = localStorage.getItem(STORAGE_KEY);
    if (current === serialized) return true;
    if (current) localStorage.setItem(BACKUP_STORAGE_KEY, current);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.warn("Sauvegarde locale impossible.", error);
    return false;
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_STORAGE_KEY);
}
