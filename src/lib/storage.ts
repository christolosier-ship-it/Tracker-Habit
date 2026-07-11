import { Habit, HabitLog, UserSettings } from '../types';
import { createDemoLogs, defaultSettings, demoHabits } from '../data/demoData';
import { defaultThemeId, resolveTheme } from '../themes/theme-registry';

export type AppData = {
  habits: Habit[];
  logs: HabitLog[];
  settings: UserSettings;
};

const KEY = 'discipline-dashboard-v2';

export const demoData = (): AppData => ({
  habits: demoHabits,
  logs: createDemoLogs(),
  settings: defaultSettings,
});

export function validateImport(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AppData>;
  return Array.isArray(candidate.habits) && Array.isArray(candidate.logs) && Boolean(candidate.settings);
}

export function migrateData(data: AppData): AppData {
  const themeId = resolveTheme(data.settings.themeId).id ?? defaultThemeId;
  return {
    ...data,
    settings: { ...defaultSettings, ...data.settings, themeId },
  };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return demoData();
    const parsed = JSON.parse(raw);
    if (!validateImport(parsed)) throw new Error('Format invalide');
    return migrateData(parsed);
  } catch {
    return demoData();
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(KEY);
}
