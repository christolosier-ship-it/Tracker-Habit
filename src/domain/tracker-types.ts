import type {
  HabitCategory,
  HabitFrequency,
  HabitPriority,
  HabitStatus,
} from "./definitions";

export type Habit = {
  id: string;
  nom: string;
  categorie: HabitCategory;
  frequence: HabitFrequency;
  objectif: string;
  priorite: HabitPriority;
  active: boolean;
  dateCreation: string;
  archivedAt?: string;
  inactiveRanges?: Array<{
    start: string;
    end: string;
  }>;
};

export type HabitLog = {
  habitId: string;
  date: string;
  status: HabitStatus;
};

export type TrackerLogReader = {
  readStatus: (habitId: string, date: string) => HabitStatus;
  readWeekLogs: (habitId: string, dateInWeek: string) => readonly HabitLog[];
};

export type AnalyticsOptions = {
  compterNonSaisisCommeManques: boolean;
};
