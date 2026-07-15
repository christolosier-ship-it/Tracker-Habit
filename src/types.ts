import type {
  HabitCategory,
  HabitFrequency,
  HabitPriority,
  HabitStatus,
} from "./domain/definitions";
import type { ThemeId } from "./themes/theme-ids";

export type {
  HabitCategory,
  HabitStatus,
} from "./domain/definitions";

export type Habit = {
  id: string;
  nom: string;
  categorie: HabitCategory;
  frequence: HabitFrequency;
  objectif: string;
  priorite: HabitPriority;
  active: boolean;
  couleur?: string;
  dateCreation: string;
};

export type HabitLog = {
  habitId: string;
  date: string;
  status: HabitStatus;
};

export type UserSettings = {
  anneeActive: number;
  moisActif: number;
  compterNonSaisisCommeManques: boolean;
  themeId: ThemeId;
  mascotEnabled: boolean;
};

export type CategoryStats = {
  categorie: HabitCategory;
  score: number;
  total: number;
};

export type StatusStats = {
  status: HabitStatus;
  label: string;
  value: number;
};
