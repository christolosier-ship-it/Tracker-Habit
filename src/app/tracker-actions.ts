import type { AppData } from "../persistence";
import type { Habit, UserSettings } from "../types";

export type SetSettings = (patch: Partial<UserSettings>) => void;
export type CycleStatus = (habitId: string, date: string) => void;
export type AddHabit = (habit: Habit) => void;
export type UpdateHabit = (
  habitId: string,
  patch: Partial<Omit<Habit, "id">>,
) => void;
export type DeleteHabit = (habitId: string) => void;
export type ReplaceData = (data: AppData) => void;
