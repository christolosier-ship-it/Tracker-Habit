import { createDemoLogs, defaultSettings, demoHabits } from "../data/demoData";
import { migrateData } from "./migrations";
import {
  BACKUP_STORAGE_KEY,
  SCHEMA_VERSION,
  STORAGE_KEY,
  type AppData,
  validateImport,
} from "./schema";

export const demoData = (): AppData => ({
  schemaVersion: SCHEMA_VERSION,
  habits: demoHabits,
  logs: createDemoLogs(),
  settings: defaultSettings,
});

function readStoredData(key: string) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const parsed: unknown = JSON.parse(raw);
  return validateImport(parsed) ? migrateData(parsed) : null;
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
      return readStoredData(BACKUP_STORAGE_KEY) ?? demoData();
    } catch {
      return demoData();
    }
  }
}

export function saveData(data: AppData) {
  try {
    const serialized = JSON.stringify(data);
    const current = localStorage.getItem(STORAGE_KEY);
    if (current === serialized) return;
    if (current) localStorage.setItem(BACKUP_STORAGE_KEY, current);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.warn("Sauvegarde locale impossible.", error);
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(BACKUP_STORAGE_KEY);
}
