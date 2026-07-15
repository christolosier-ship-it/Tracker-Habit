import { HABIT_STATUS_DEFINITIONS } from "./definitions";
import type {
  AnalyticsOptions,
  Habit,
  TrackerLogReader,
} from "./tracker-types";
import type { HabitStatus } from "./definitions";
import { compareIsoDates } from "../lib/date-utils";

export type TrackerEvaluation = {
  habitId: string;
  date: string;
  status: HabitStatus;
  score: number | null;
};

export type ScoreAggregate = {
  opportunities: number;
  score: number | null;
  successRate: number | null;
};

export function habitExistsOnDate(habit: Habit, date: string) {
  return (
    compareIsoDates(date, habit.dateCreation) >= 0 &&
    (!habit.archivedAt || compareIsoDates(date, habit.archivedAt) <= 0) &&
    !habit.inactiveRanges?.some(
      (range) =>
        compareIsoDates(date, range.start) >= 0 &&
        compareIsoDates(date, range.end) <= 0,
    )
  );
}

export function statusScore(
  status: HabitStatus,
  date: string,
  options: AnalyticsOptions,
  today: string,
) {
  if (
    status === "empty" &&
    options.compterNonSaisisCommeManques &&
    compareIsoDates(date, today) < 0
  ) {
    return 0;
  }
  return HABIT_STATUS_DEFINITIONS[status].score;
}

export function evaluateDailyHabit(
  habit: Habit,
  date: string,
  reader: TrackerLogReader,
  options: AnalyticsOptions,
  today: string,
): TrackerEvaluation | null {
  if (!habitExistsOnDate(habit, date)) return null;
  const status = reader.readStatus(habit.id, date);
  const score = statusScore(status, date, options, today);
  if (score === null && status === "empty") return null;
  return {
    habitId: habit.id,
    date,
    status,
    score,
  };
}

export function evaluateWeeklyHabit(
  habit: Habit,
  weekStart: string,
  weekEnd: string,
  reader: TrackerLogReader,
  options: AnalyticsOptions,
  today: string,
): TrackerEvaluation | null {
  if (
    compareIsoDates(weekEnd, habit.dateCreation) < 0 ||
    (habit.archivedAt && compareIsoDates(weekStart, habit.archivedAt) > 0)
  ) {
    return null;
  }

  const weekLogs = reader.readWeekLogs(habit.id, weekStart).filter(
    (log) =>
      compareIsoDates(log.date, weekStart) >= 0 &&
      compareIsoDates(log.date, weekEnd) <= 0 &&
      habitExistsOnDate(habit, log.date),
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
  const effectiveDate = habit.archivedAt && compareIsoDates(habit.archivedAt, weekEnd) < 0
    ? habit.archivedAt
    : weekEnd;
  const score = statusScore(status, effectiveDate, options, today);
  if (score === null && status === "empty") return null;

  return {
    habitId: habit.id,
    date: weekEnd,
    status,
    score,
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
    opportunities,
    score: opportunities ? Math.round((earned / opportunities) * 100) : null,
    successRate: opportunities
      ? Math.round((done / opportunities) * 100)
      : null,
  };
}
