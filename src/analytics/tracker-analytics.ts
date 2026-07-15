import {
  HABIT_STATUS_CYCLE,
  HABIT_STATUS_DEFINITIONS,
  type HabitStatus,
} from "../domain/definitions";
import {
  aggregateEvaluations,
  evaluateDailyHabit,
  evaluateWeeklyHabit,
  habitExistsOnDate,
  statusScore,
  type TrackerEvaluation,
} from "../domain/evaluation";
import type {
  AnalyticsOptions,
  Habit,
  HabitLog,
} from "../domain/tracker-types";
import {
  compareIsoDates,
  formatLocalIso,
  getIsoWeekBounds,
  iterateIsoDates,
  monthPrefix,
} from "../lib/date-utils";
import {
  buildTrackerIndex,
  readTrackerStatus,
} from "./tracker-index";

const ANTI_CATEGORIES = new Set(["Productivité", "Anti-procrastination"]);

type HabitScore = { nom: string; score: number };
export type MonthlyScore = { mois: string; score: number | null };
export type CategoryStats = {
  categorie: Habit["categorie"];
  score: number;
  total: number;
};
export type StatusStats = {
  status: HabitStatus;
  label: string;
  value: number;
};

export type DashboardAnalytics = {
  scoreGlobal: number | null;
  currentMonth: number | null;
  success: number | null;
  anti: number | null;
  disciplinedDays: number;
  currentStreak: number;
  doneLogs: number;
  activeHabits: number;
  monthly: MonthlyScore[];
  antiMonthly: { mois: string; anti: number | null }[];
  categoryStats: CategoryStats[];
  statusStats: StatusStats[];
  topHabits: HabitScore[];
  fragileHabits: HabitScore[];
  antiTopHabit: HabitScore | null;
  antiFragileHabit: HabitScore | null;
  annualRates: {
    id: string;
    nom: string;
    categorie: Habit["categorie"];
    values: Array<number | null>;
  }[];
  priorityDays: number;
};

export type MascotAnalytics = {
  todayScore: number | null;
  currentMonthScore: number | null;
  fragileHabitCount: number;
};

function percentage(earned: number, total: number) {
  return total ? Math.round((earned / total) * 100) : null;
}

function isAntiHabit(habit: Habit) {
  return ANTI_CATEGORIES.has(habit.categorie);
}

function isPriorityHabit(habit: Habit) {
  return habit.priorite === "haute" || isAntiHabit(habit);
}

function aggregateAnti(evaluations: readonly TrackerEvaluation[]) {
  const base = aggregateEvaluations(evaluations).score;
  if (base === null) return null;
  const missed = evaluations.filter((item) => item.status === "missed").length;
  return Math.max(0, Math.min(100, base - Math.min(15, Math.round(missed / 10))));
}

function resolveToday(value: Date | string) {
  return typeof value === "string" ? value : formatLocalIso(value);
}

export function createTrackerAnalytics(
  habits: Habit[],
  logs: HabitLog[],
  options: AnalyticsOptions,
  currentDate: Date | string = new Date(),
) {
  const today = resolveToday(currentDate);
  const activeHabits = habits.filter(
    (habit) => habit.active && habitExistsOnDate(habit, today),
  );
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));
  const weeklyHabitIds = new Set(
    habits
      .filter((habit) => habit.frequence === "hebdomadaire")
      .map((habit) => habit.id),
  );
  const index = buildTrackerIndex(logs, weeklyHabitIds);
  const evaluationsByYear = new Map<number, TrackerEvaluation[]>();
  const dayScoreCache = new Map<
    string,
    { score: number | null; opportunities: number; tracked: boolean }
  >();
  const disciplineScoreCache = new Map<
    string,
    { score: number | null; tracked: boolean }
  >();

  function evaluationsForYear(year: number) {
    const cached = evaluationsByYear.get(year);
    if (cached) return cached;

    const evaluations: TrackerEvaluation[] = [];
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;
    const observableEnd = compareIsoDates(yearEnd, today) > 0 ? today : yearEnd;

    if (compareIsoDates(yearStart, observableEnd) <= 0) {
      for (const habit of habits) {
        if (habit.frequence !== "quotidienne") continue;
        const start = compareIsoDates(habit.dateCreation, yearStart) > 0
          ? habit.dateCreation
          : yearStart;
        const end = habit.archivedAt && compareIsoDates(habit.archivedAt, observableEnd) < 0
          ? habit.archivedAt
          : observableEnd;
        if (compareIsoDates(start, end) > 0) continue;
        for (const date of iterateIsoDates(start, end)) {
          const evaluation = evaluateDailyHabit(
            habit,
            date,
            index,
            options,
            today,
          );
          if (evaluation) evaluations.push(evaluation);
        }
      }
    }

    const weeks = new Map<string, { start: string; end: string }>();
    for (const date of iterateIsoDates(yearStart, observableEnd)) {
      const bounds = getIsoWeekBounds(date);
      if (!weeks.has(bounds.start)) weeks.set(bounds.start, bounds);
    }
    for (const habit of habits) {
      if (habit.frequence !== "hebdomadaire") continue;
      for (const bounds of weeks.values()) {
        const end = compareIsoDates(bounds.end, observableEnd) > 0
          ? observableEnd
          : bounds.end;
        const evaluation = evaluateWeeklyHabit(
          habit,
          bounds.start,
          end,
          index,
          options,
          today,
        );
        if (evaluation && evaluation.date.startsWith(String(year))) {
          evaluations.push(evaluation);
        }
      }
    }

    evaluationsByYear.set(year, evaluations);
    return evaluations;
  }

  function dayScore(date: string) {
    const cached = dayScoreCache.get(date);
    if (cached) return cached;
    let earned = 0;
    let opportunities = 0;
    let tracked = false;

    for (const habit of habits) {
      if (!habitExistsOnDate(habit, date)) continue;
      const status = readTrackerStatus(index, habit.id, date);
      if (status !== "empty") tracked = true;
      if (habit.frequence === "hebdomadaire" && status === "empty") continue;
      const score = statusScore(status, date, options, today);
      if (score !== null) {
        earned += score;
        opportunities += 1;
      }
    }

    const result = { score: percentage(earned, opportunities), opportunities, tracked };
    dayScoreCache.set(date, result);
    return result;
  }

  function isPerfectDay(date: string) {
    const due = habits.filter(
      (habit) =>
        habit.frequence === "quotidienne" && habitExistsOnDate(habit, date),
    );
    if (!due.length) return false;
    let completed = 0;
    for (const habit of due) {
      const status = readTrackerStatus(index, habit.id, date);
      if (status !== "done" && status !== "rest") return false;
      if (status === "done") completed += 1;
    }
    return completed > 0;
  }

  function disciplineDayScore(date: string) {
    const cached = disciplineScoreCache.get(date);
    if (cached) return cached;
    const tracked = (index.byDate.get(date) ?? []).some((log) => {
      const habit = habitById.get(log.habitId);
      return Boolean(habit && habitExistsOnDate(habit, date));
    });

    let earned = 0;
    let opportunities = 0;
    for (const habit of habits) {
      if (!habitExistsOnDate(habit, date)) continue;
      const status = readTrackerStatus(index, habit.id, date);
      if (habit.frequence === "hebdomadaire" && status === "empty") continue;
      const score = statusScore(status, date, options, today);
      if (score === null) continue;
      earned += score;
      opportunities += 1;
    }
    const result = { score: percentage(earned, opportunities), tracked };
    disciplineScoreCache.set(date, result);
    return result;
  }

  function streaksForYear(year: number) {
    const end = compareIsoDates(`${year}-12-31`, today) > 0
      ? today
      : `${year}-12-31`;
    if (compareIsoDates(`${year}-01-01`, end) > 0) return { best: 0 };
    let best = 0;
    let current = 0;
    for (const date of iterateIsoDates(`${year}-01-01`, end)) {
      const day = disciplineDayScore(date);
      current = day.tracked && day.score !== null && day.score >= 70
        ? current + 1
        : 0;
      best = Math.max(best, current);
    }
    return { best };
  }

  function previousDate(date: string) {
    const value = new Date(`${date}T12:00:00`);
    value.setDate(value.getDate() - 1);
    return formatLocalIso(value);
  }

  function currentStreak() {
    let cursor = today;
    if (!disciplineDayScore(cursor).tracked) cursor = previousDate(cursor);
    let total = 0;
    for (let day = 0; day < 365; day += 1) {
      const snapshot = disciplineDayScore(cursor);
      if (!snapshot.tracked || snapshot.score === null || snapshot.score < 70) break;
      total += 1;
      cursor = previousDate(cursor);
    }
    return total;
  }

  function disciplinedDays(year: number) {
    let count = 0;
    for (const date of index.byDate.keys()) {
      if (compareIsoDates(date, today) > 0) continue;
      const snapshot = disciplineDayScore(date);
      if (
        date.startsWith(`${year}-`) &&
        snapshot.tracked &&
        snapshot.score !== null &&
        snapshot.score >= 70
      ) {
        count += 1;
      }
    }
    return count;
  }

  function habitScores(evaluations: readonly TrackerEvaluation[]) {
    const grouped = new Map<string, TrackerEvaluation[]>();
    for (const evaluation of evaluations) {
      if (evaluation.score === null) continue;
      const bucket = grouped.get(evaluation.habitId);
      if (bucket) bucket.push(evaluation);
      else grouped.set(evaluation.habitId, [evaluation]);
    }
    return [...grouped.entries()].flatMap(([habitId, items]) => {
      const habit = habitById.get(habitId);
      const score = aggregateEvaluations(items).score;
      return habit && score !== null ? [{ nom: habit.nom, score }] : [];
    });
  }

  function dashboard(
    year: number,
    month: number,
    monthLabels: readonly string[],
  ): DashboardAnalytics {
    const evaluations = evaluationsForYear(year);
    const monthlyEvaluations = Array.from(
      { length: 12 },
      () => [] as TrackerEvaluation[],
    );
    const monthlyByHabit = Array.from(
      { length: 12 },
      () => new Map<string, TrackerEvaluation[]>(),
    );
    for (const evaluation of evaluations) {
      const monthIndex = Number(evaluation.date.slice(5, 7)) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyEvaluations[monthIndex].push(evaluation);
        const own = monthlyByHabit[monthIndex].get(evaluation.habitId);
        if (own) own.push(evaluation);
        else monthlyByHabit[monthIndex].set(evaluation.habitId, [evaluation]);
      }
    }

    const categoryGroups = new Map<Habit["categorie"], TrackerEvaluation[]>();
    for (const evaluation of evaluations) {
      const habit = habitById.get(evaluation.habitId);
      if (!habit || evaluation.score === null) continue;
      const bucket = categoryGroups.get(habit.categorie);
      if (bucket) bucket.push(evaluation);
      else categoryGroups.set(habit.categorie, [evaluation]);
    }
    const categoryStats: CategoryStats[] = [...categoryGroups.entries()].flatMap(
      ([categorie, items]) => {
        const aggregate = aggregateEvaluations(items);
        return aggregate.score === null
          ? []
          : [{ categorie, score: aggregate.score, total: aggregate.opportunities }];
      },
    );

    const yearStart = `${year}-01-01`;
    const yearEnd = compareIsoDates(`${year}-12-31`, today) > 0
      ? today
      : `${year}-12-31`;
    const relevantHabits = habits.filter(
      (habit) =>
        compareIsoDates(habit.dateCreation, yearEnd) <= 0 &&
        (!habit.archivedAt || compareIsoDates(habit.archivedAt, yearStart) >= 0),
    );
    const relevantIds = new Set(relevantHabits.map((habit) => habit.id));
    const explicitYearLogs = logs.filter((log) => {
      const habit = habitById.get(log.habitId);
      return (
        relevantIds.has(log.habitId) &&
        log.date.startsWith(`${year}-`) &&
        compareIsoDates(log.date, today) <= 0 &&
        Boolean(habit && habitExistsOnDate(habit, log.date))
      );
    });
    const statusCounts = new Map<HabitStatus, number>();
    for (const log of explicitYearLogs) {
      statusCounts.set(log.status, (statusCounts.get(log.status) ?? 0) + 1);
    }
    const statusStats: StatusStats[] = HABIT_STATUS_CYCLE
      .filter((status) => status !== "empty")
      .map((status) => ({
        status,
        label: HABIT_STATUS_DEFINITIONS[status].label,
        value: statusCounts.get(status) ?? 0,
      }));

    const ranked = habitScores(evaluations);
    const topHabits = [...ranked]
      .sort((left, right) => right.score - left.score)
      .slice(0, 10);
    const fragileHabits = [...ranked]
      .filter((habit) => habit.score < 70)
      .sort((left, right) => left.score - right.score)
      .slice(0, 6);

    const annualRates = relevantHabits.map((habit) => ({
      id: habit.id,
      nom: habit.nom,
      categorie: habit.categorie,
      values: monthlyByHabit.map((items) =>
        aggregateEvaluations(items.get(habit.id) ?? []).score,
      ),
    }));

    const antiIds = new Set(habits.filter(isAntiHabit).map((habit) => habit.id));
    const antiEvaluations = evaluations.filter((item) => antiIds.has(item.habitId));
    const antiRanked = habitScores(antiEvaluations).sort(
      (left, right) => right.score - left.score,
    );
    const antiByMonth = monthlyEvaluations.map((items) =>
      aggregateAnti(items.filter((item) => antiIds.has(item.habitId))),
    );
    const priorityIds = new Set(habits.filter(isPriorityHabit).map((habit) => habit.id));
    const aggregate = aggregateEvaluations(evaluations);

    return {
      scoreGlobal: aggregate.score,
      currentMonth: aggregateEvaluations(monthlyEvaluations[month]).score,
      success: aggregate.successRate,
      anti: aggregateAnti(antiEvaluations),
      disciplinedDays: disciplinedDays(year),
      currentStreak: currentStreak(),
      doneLogs: explicitYearLogs.filter((log) => log.status === "done").length,
      activeHabits: activeHabits.length,
      monthly: monthLabels.map((mois, index) => ({
        mois,
        score: aggregateEvaluations(monthlyEvaluations[index]).score,
      })),
      antiMonthly: monthLabels.map((mois, index) => ({
        mois,
        anti: antiByMonth[index],
      })),
      categoryStats,
      statusStats,
      topHabits,
      fragileHabits,
      antiTopHabit: antiRanked[0] ?? null,
      antiFragileHabit:
        [...antiRanked].sort((left, right) => left.score - right.score)[0] ?? null,
      annualRates,
      priorityDays: new Set(
        explicitYearLogs
          .filter((log) => priorityIds.has(log.habitId) && log.status === "done")
          .map((log) => log.date),
      ).size,
    };
  }

  function mascot(): MascotAnalytics {
    const year = Number(today.slice(0, 4));
    const month = Number(today.slice(5, 7)) - 1;
    const monthEvaluations = evaluationsForYear(year).filter((evaluation) =>
      evaluation.date.startsWith(monthPrefix(year, month)),
    );
    return {
      todayScore: dayScore(today).score,
      currentMonthScore: aggregateEvaluations(monthEvaluations).score,
      fragileHabitCount: habitScores(monthEvaluations).filter(
        (habit) => habit.score < 50,
      ).length,
    };
  }

  function monthScore(year: number, month: number, habitIds?: ReadonlySet<string>) {
    const prefix = monthPrefix(year, month);
    return aggregateEvaluations(
      evaluationsForYear(year).filter(
        (item) =>
          item.date.startsWith(prefix) &&
          (!habitIds || habitIds.has(item.habitId)),
      ),
    ).score;
  }

  function monthScores(year: number, month: number) {
    const prefix = monthPrefix(year, month);
    const evaluations = evaluationsForYear(year).filter((item) =>
      item.date.startsWith(prefix),
    );
    const byHabit = new Map<string, TrackerEvaluation[]>();
    for (const evaluation of evaluations) {
      const own = byHabit.get(evaluation.habitId);
      if (own) own.push(evaluation);
      else byHabit.set(evaluation.habitId, [evaluation]);
    }
    return new Map(
      habits.map((habit) => [
        habit.id,
        aggregateEvaluations(byHabit.get(habit.id) ?? []).score,
      ]),
    );
  }

  return {
    today,
    index,
    evaluationsForYear,
    dayScore,
    isPerfectDay,
    currentStreak,
    bestStreak: (year: number) => streaksForYear(year).best,
    disciplinedDays,
    monthScore,
    dashboard,
    mascot,
    monthScores,
  };
}

export type TrackerAnalytics = ReturnType<typeof createTrackerAnalytics>;
