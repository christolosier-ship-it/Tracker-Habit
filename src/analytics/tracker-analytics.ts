import { HABIT_STATUS_CYCLE, HABIT_STATUS_DEFINITIONS } from "../domain/definitions";
import {
  aggregateEvaluations,
  evaluateDailyHabit,
  evaluateWeeklyHabit,
  habitExistsOnDate,
  statusScore,
  type TrackerEvaluation,
} from "../domain/evaluation";
import type {
  CategoryStats,
  Habit,
  HabitLog,
  HabitStatus,
  StatusStats,
  UserSettings,
} from "../types";
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

const ANTI_PATTERN = /prioritaire|deep work|scrolling|pénible|repoussé/i;
const ANTI_CATEGORIES = new Set(["Productivité", "Anti-procrastination"]);

type HabitScore = { nom: string; score: number };

export type DashboardAnalytics = {
  scoreGlobal: number;
  todayScore: number;
  currentMonth: number;
  success: number;
  anti: number;
  disciplinedDays: number;
  currentStreak: number;
  bestStreak: number;
  doneLogs: number;
  activeHabits: number;
  monthly: { mois: string; score: number }[];
  antiMonthly: { mois: string; anti: number }[];
  categoryStats: CategoryStats[];
  statusStats: StatusStats[];
  topHabits: HabitScore[];
  fragileHabits: HabitScore[];
  annualRates: {
    id: string;
    nom: string;
    categorie: Habit["categorie"];
    frequence: Habit["frequence"];
    values: number[];
  }[];
  priorityDays: number;
};

export type MascotAnalytics = {
  todayScore: number;
  currentMonthScore: number;
  fragileHabitCount: number;
};

function percentage(earned: number, total: number) {
  return total ? Math.round((earned / total) * 100) : 0;
}

function isAntiHabit(habit: Habit) {
  return ANTI_CATEGORIES.has(habit.categorie) || ANTI_PATTERN.test(habit.nom);
}

function isPriorityHabit(habit: Habit) {
  return habit.priorite === "haute" || isAntiHabit(habit);
}

function aggregateAnti(evaluations: readonly TrackerEvaluation[]) {
  const base = aggregateEvaluations(evaluations).score;
  const missed = evaluations.filter((item) => item.status === "missed").length;
  return Math.max(0, Math.min(100, base - Math.min(15, Math.round(missed / 10))));
}

export function createTrackerAnalytics(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
  now = new Date(),
) {
  const today = formatLocalIso(now);
  const activeHabits = habits.filter((habit) => habit.active);
  const activeIds = new Set(activeHabits.map((habit) => habit.id));
  const habitById = new Map(habits.map((habit) => [habit.id, habit]));
  const index = buildTrackerIndex(logs);
  const evaluationsByYear = new Map<number, TrackerEvaluation[]>();
  const dayScoreCache = new Map<string, { score: number; tracked: boolean }>();
  const disciplineScoreCache = new Map<
    string,
    { score: number; tracked: boolean }
  >();

  function evaluationsForYear(year: number) {
    const cached = evaluationsByYear.get(year);
    if (cached) return cached;

    const evaluations: TrackerEvaluation[] = [];
    const yearStart = `${year}-01-01`;
    const yearEnd = `${year}-12-31`;
    const dailyEnd = compareIsoDates(yearEnd, today) > 0 ? today : yearEnd;

    if (compareIsoDates(yearStart, today) <= 0) {
      for (const habit of activeHabits) {
        if (habit.frequence !== "quotidienne") continue;
        const start = compareIsoDates(habit.dateCreation, yearStart) > 0
          ? habit.dateCreation
          : yearStart;
        if (compareIsoDates(start, dailyEnd) > 0) continue;
        for (const date of iterateIsoDates(start, dailyEnd)) {
          const evaluation = evaluateDailyHabit(
            habit,
            date,
            index,
            settings,
            today,
          );
          if (evaluation) evaluations.push(evaluation);
        }
      }
    }

    const weeks = new Map<string, { start: string; end: string }>();
    for (const date of iterateIsoDates(yearStart, yearEnd)) {
      const bounds = getIsoWeekBounds(date);
      if (bounds.end.startsWith(String(year))) weeks.set(bounds.end, bounds);
    }
    for (const habit of activeHabits) {
      if (habit.frequence !== "hebdomadaire") continue;
      for (const bounds of weeks.values()) {
        const evaluation = evaluateWeeklyHabit(
          habit,
          bounds.start,
          bounds.end,
          index,
          settings,
          today,
        );
        if (evaluation) evaluations.push(evaluation);
      }
    }

    evaluationsByYear.set(year, evaluations);
    return evaluations;
  }

  function dayScore(date: string) {
    const cached = dayScoreCache.get(date);
    if (cached) return cached;
    let earned = 0;
    let total = 0;
    let tracked = false;

    for (const habit of activeHabits) {
      if (!habitExistsOnDate(habit, date)) continue;
      const status = readTrackerStatus(index, habit.id, date);
      if (status !== "empty") tracked = true;
      if (habit.frequence === "hebdomadaire" && status === "empty") continue;
      const score = statusScore(status, date, settings, today);
      if (score !== null) {
        earned += score;
        total += 1;
      }
    }

    const result = { score: percentage(earned, total), tracked };
    dayScoreCache.set(date, result);
    return result;
  }

  function isPerfectDay(date: string) {
    const due = activeHabits.filter(
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
    const tracked = (index.byDate.get(date) ?? []).some(
      (log) => activeIds.has(log.habitId) && log.status !== "empty",
    );
    if (!tracked) {
      const result = { score: 0, tracked: false };
      disciplineScoreCache.set(date, result);
      return result;
    }

    let earned = 0;
    let total = 0;
    for (const habit of activeHabits) {
      if (!habitExistsOnDate(habit, date)) continue;
      const status = readTrackerStatus(index, habit.id, date);
      if (habit.frequence === "hebdomadaire" && status === "empty") continue;
      if (status === "rest") continue;
      const score = HABIT_STATUS_DEFINITIONS[status].score ?? 0;
      earned += score;
      total += 1;
    }
    const result = { score: percentage(earned, total), tracked };
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
      current = day.tracked && day.score >= 70 ? current + 1 : 0;
      best = Math.max(best, current);
    }
    return { best };
  }

  function currentStreak() {
    let cursor = today;
    if (!disciplineDayScore(cursor).tracked) {
      const date = new Date(now);
      date.setDate(date.getDate() - 1);
      cursor = formatLocalIso(date);
    }
    let total = 0;
    for (let day = 0; day < 365; day += 1) {
      const snapshot = disciplineDayScore(cursor);
      if (!snapshot.tracked || snapshot.score < 70) break;
      total += 1;
      const date = new Date(`${cursor}T12:00:00`);
      date.setDate(date.getDate() - 1);
      cursor = formatLocalIso(date);
    }
    return total;
  }

  function disciplinedDays(year: number) {
    const dates = index.byDate.keys();
    let count = 0;
    for (const date of dates) {
      if (
        date.startsWith(`${year}-`) &&
        disciplineDayScore(date).score >= 70
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
      return habit
        ? [{ nom: habit.nom, score: aggregateEvaluations(items).score }]
        : [];
    });
  }

  function dashboard(
    year: number,
    month: number,
    monthLabels: readonly string[],
  ): DashboardAnalytics {
    const evaluations = evaluationsForYear(year);
    const monthlyEvaluations = Array.from({ length: 12 }, () => [] as TrackerEvaluation[]);
    for (const evaluation of evaluations) {
      const monthIndex = Number(evaluation.date.slice(5, 7)) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyEvaluations[monthIndex].push(evaluation);
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
    const categoryStats: CategoryStats[] = [...categoryGroups.entries()].map(
      ([categorie, items]) => ({
        categorie,
        score: aggregateEvaluations(items).score,
        total: aggregateEvaluations(items).opportunities,
      }),
    );

    const statusCounts = new Map<HabitStatus, number>(
      HABIT_STATUS_CYCLE.map((status) => [status, 0]),
    );
    for (const evaluation of evaluations) {
      statusCounts.set(
        evaluation.status,
        (statusCounts.get(evaluation.status) ?? 0) + 1,
      );
    }
    const statusStats: StatusStats[] = HABIT_STATUS_CYCLE.map((status) => ({
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

    const annualRates = activeHabits.slice(0, 30).map((habit) => ({
      id: habit.id,
      nom: habit.nom,
      categorie: habit.categorie,
      frequence: habit.frequence,
      values: monthlyEvaluations.map((items) => {
        const own = items.filter((item) => item.habitId === habit.id);
        const aggregate = aggregateEvaluations(own);
        return aggregate.opportunities ? aggregate.score : -1;
      }),
    }));

    const antiIds = new Set(activeHabits.filter(isAntiHabit).map((habit) => habit.id));
    const antiByMonth = monthlyEvaluations.map((items) =>
      aggregateAnti(items.filter((item) => antiIds.has(item.habitId))),
    );
    const priorityIds = new Set(
      activeHabits.filter(isPriorityHabit).map((habit) => habit.id),
    );
    const yearPrefix = `${year}-`;
    const explicitYearLogs = logs.filter(
      (log) => activeIds.has(log.habitId) && log.date.startsWith(yearPrefix),
    );

    const aggregate = aggregateEvaluations(evaluations);
    return {
      scoreGlobal: aggregate.score,
      todayScore: dayScore(today).score,
      currentMonth: aggregateEvaluations(monthlyEvaluations[month]).score,
      success: aggregate.successRate,
      anti: aggregateAnti(evaluations.filter((item) => antiIds.has(item.habitId))),
      disciplinedDays: disciplinedDays(year),
      currentStreak: currentStreak(),
      bestStreak: streaksForYear(year).best,
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
      annualRates,
      priorityDays: new Set(
        explicitYearLogs
          .filter(
            (log) => priorityIds.has(log.habitId) && log.status === "done",
          )
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
    const fragileHabitCount = habitScores(monthEvaluations).filter(
      (habit) => habit.score < 50,
    ).length;
    return {
      todayScore: dayScore(today).score,
      currentMonthScore: aggregateEvaluations(monthEvaluations).score,
      fragileHabitCount,
    };
  }

  function yearScore(year: number) {
    return aggregateEvaluations(evaluationsForYear(year)).score;
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
    return new Map(
      activeHabits.map((habit) => {
        const own = evaluations.filter((item) => item.habitId === habit.id);
        const aggregate = aggregateEvaluations(own);
        return [habit.id, aggregate.opportunities ? aggregate.score : -1];
      }),
    );
  }

  return {
    index,
    evaluationsForYear,
    dayScore,
    isPerfectDay,
    currentStreak,
    bestStreak: (year: number) => streaksForYear(year).best,
    disciplinedDays,
    yearScore,
    monthScore,
    dashboard,
    mascot,
    monthScores,
  };
}
