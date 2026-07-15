export const HABIT_CATEGORIES = [
  "Routine",
  "Santé",
  "Productivité",
  "Anti-procrastination",
  "Maison",
  "Famille",
  "Développement",
  "Finances",
  "Projet perso",
  "Autre",
] as const;

export const HABIT_FREQUENCIES = ["quotidienne", "hebdomadaire"] as const;
export const HABIT_PRIORITIES = ["faible", "normale", "haute"] as const;
export const HABIT_STATUSES = [
  "empty",
  "done",
  "partial",
  "missed",
  "rest",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type HabitFrequency = (typeof HABIT_FREQUENCIES)[number];
export type HabitPriority = (typeof HABIT_PRIORITIES)[number];
export type HabitStatus = (typeof HABIT_STATUSES)[number];

export const HABIT_STATUS_DEFINITIONS = {
  empty: { label: "Non saisi", score: null, symbol: "·" },
  done: { label: "Accompli", score: 1, symbol: "✓" },
  partial: { label: "Partiel", score: 0.5, symbol: "◐" },
  missed: { label: "Manqué", score: 0, symbol: "×" },
  rest: { label: "Repos", score: null, symbol: "Ⅱ" },
} as const satisfies Record<
  HabitStatus,
  { label: string; score: number | null; symbol: string }
>;

export const HABIT_STATUS_CYCLE: readonly HabitStatus[] = HABIT_STATUSES;

function includes<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export const isHabitCategory = (value: unknown): value is HabitCategory =>
  includes(HABIT_CATEGORIES, value);

export const isHabitFrequency = (value: unknown): value is HabitFrequency =>
  includes(HABIT_FREQUENCIES, value);

export const isHabitPriority = (value: unknown): value is HabitPriority =>
  includes(HABIT_PRIORITIES, value);

export const isHabitStatus = (value: unknown): value is HabitStatus =>
  includes(HABIT_STATUSES, value);
