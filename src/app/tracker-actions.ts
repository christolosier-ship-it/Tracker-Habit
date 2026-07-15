import type { ImportableAppData } from "../persistence";
import type { Habit, UserSettings } from "../types";

export type SetSettings = (patch: Partial<UserSettings>) => void;
export type CycleStatus = (habitId: string, date: string) => void;
export type AddHabit = (habit: Habit) => void;
export type UpdateHabitPatch = Partial<
  Pick<
    Habit,
    "nom" | "categorie" | "frequence" | "objectif" | "priorite" | "active"
  >
>;
export type UpdateHabit = (
  habitId: string,
  patch: UpdateHabitPatch,
) => void;
export type DeleteHabit = (habitId: string) => void;
export type ReplaceData = (data: ImportableAppData) => void;
