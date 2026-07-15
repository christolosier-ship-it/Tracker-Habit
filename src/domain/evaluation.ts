import { HABIT_STATUS_DEFINITIONS } from "./definitions";
import type { Habit, HabitStatus, UserSettings } from "../types";
import type { TrackerIndex } from "../analytics/tracker-index";
import {
  readHabitWeekLogs,
  readTrackerStatus,
} from "../analytics/tracker-index";
import { compareIsoDates } from "../lib/date-utils";

export type TrackerEvaluation = {
  habitId: string;
  date: string;
  status: HabitStatus;
  score: number | null;
  synthetic: boolean;
};

export type ScoreAggregate = {
  earned: number;
  opportunities: number;
  done: number;
  score: number;
  successRate: number;
};

export function habitExistsOnDate(habit: Habit, date: string) {
  return compareIsoDates(date, habit.dateCreation) >= 0;
}

export function statusScore(
  status: HabitStatus,
  date: string,
  settings: UserSettings,
  today: string,
) {
  if (
    status === "empty" &&
    settings.compterNonSaisisCommeManques &&
    compareIsoDates(date, today) < 0
  ) {
    return 0;
  }
  return HABIT_STATUS_DEFINITIONS[status].score;
}

export function evaluateDailyHabit(
  habit: Habit,
  date: string,
  index: TrackerIndex,
  settings: UserSettings,
  today: string,
): TrackerEvaluation | null {
  if (!habit.active || !habitExistsOnDate(habit, date)) return null;
  const status = readTrackerStatus(index, habit.id, date);
  const score = statusScore(status, date, settings, today);
  if (score === null && status === "empty") return null;
  return {
    habitId: habit.id,
    date,
    status,
    score,
    synthetic: status === "empty",
  };
}

export function evaluateWeeklyHabit(
  habit: Habit,
  weekStart: string,
  weekEnd: string,
  index: TrackerIndex,
  settings: UserSettings,
  today: string,
): TrackerEvaluation | null {
  if (!habit.active || compareIsoDates(weekEnd, habit.dateCreation) < 0) {
    return null;
  }

  const weekLogs = readHabitWeekLogs(index, habit.id, weekStart).filter(
    (log) =>
      compareIsoDates(log.date, weekStart) >= 0 &&
      compareIsoDates(log.date, weekEnd) <= 0 &&
      compareIsoDates(log.date, habit.dateCreation) >= 0,
  );
  const statuses = new Set(weekLogs.map((log) => log.status));
  const status: HabitStatus = statuses.has("done")
    ? "done"
    : statuses.has("partial")
      ? "partial"
      : statuses.has("missed")
        ? "missed"
        : statuses.has("rest")
          ? "rest"
          : "empty";
  const score = statusScore(status, weekEnd, settings, today);
  if (score === null && status === "empty") return null;

  return {
    habitId: habit.id,
    date: weekEnd,
    status,
    score,
    synthetic: status === "empty",
  };
}

export function aggregateEvaluations(
  evaluations: readonly TrackerEvaluation[],
): ScoreAggregate {
  let earned = 0;
  let opportunities = 0;
  let done = 0;

  for (const evaluation of evaluations) {
    if (evaluation.score === null) continue;
    earned += evaluation.score;
    opportunities += 1;
    if (evaluation.status === "done") done += 1;
  }

  return {
    earned,
    opportunities,
    done,
    score: opportunities ? Math.round((earned / opportunities) * 100) : 0,
    successRate: opportunities
      ? Math.round((done / opportunities) * 100)
      : 0,
  };
}
