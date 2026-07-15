import {
  CategoryStats,
  Habit,
  HabitLog,
  HabitStatus,
  StatusStats,
  UserSettings,
} from "../types";
import {
  HABIT_STATUS_CYCLE,
  HABIT_STATUS_DEFINITIONS,
} from "../domain/definitions";
import {
  compareIsoDates,
  daysInMonth,
  formatLocalIso,
  getIsoWeekKey,
  isIsoDatePast,
  iterateIsoDates,
  monthPrefix,
  parseLocalIso,
} from "./date-utils";
import { buildLogIndex, LogIndex } from "./log-index";

export const statusLabels = Object.fromEntries(
  HABIT_STATUS_CYCLE.map((status) => [
    status,
    HABIT_STATUS_DEFINITIONS[status].label,
  ]),
) as Record<HabitStatus, string>;

export const statusCycle = [...HABIT_STATUS_CYCLE];

export function getStatusScore(
  status: HabitStatus,
  countEmpty = false,
  past = false,
) {
  if (status === "empty" && countEmpty && past) return 0;
  return HABIT_STATUS_DEFINITIONS[status].score;
}

export function logFor(
  logs: HabitLog[] | LogIndex,
  habitId: string,
  date: string,
): HabitStatus {
  if (logs instanceof Map) return logs.get(`${habitId}|${date}`) ?? "empty";
  return (
    logs.find((log) => log.habitId === habitId && log.date === date)?.status ??
    "empty"
  );
}

export function setLog(
  logs: HabitLog[],
  habitId: string,
  date: string,
  status: HabitStatus,
) {
  const index = logs.findIndex(
    (log) => log.habitId === habitId && log.date === date,
  );
  if (index >= 0) {
    const next = [...logs];
    if (status === "empty") {
      next.splice(index, 1);
      return next;
    }
    next[index] = { habitId, date, status };
    return next;
  }
  return status === "empty" ? logs : [...logs, { habitId, date, status }];
}

function habitExistsOnDate(habit: Habit, date: string) {
  return compareIsoDates(date, habit.dateCreation) >= 0;
}

function scoreExplicitLogs(logs: HabitLog[], settings: UserSettings) {
  let got = 0;
  let total = 0;
  for (const log of logs) {
    const score = getStatusScore(
      log.status,
      settings.compterNonSaisisCommeManques,
      isIsoDatePast(log.date),
    );
    if (score !== null) {
      got += score;
      total += 1;
    }
  }
  return { got, total, score: total ? Math.round((got / total) * 100) : 0 };
}

function weeklyScoreForPeriod(
  habit: Habit,
  logs: HabitLog[],
  dates: string[],
  settings: UserSettings,
) {
  const weeks = new Map<string, string[]>();
  for (const date of dates) {
    if (!habitExistsOnDate(habit, date)) continue;
    const key = getIsoWeekKey(date);
    const bucket = weeks.get(key) ?? [];
    bucket.push(date);
    weeks.set(key, bucket);
  }

  let got = 0;
  let total = 0;
  for (const weekDates of weeks.values()) {
    const weekLogs = logs.filter(
      (log) =>
        log.habitId === habit.id &&
        weekDates.includes(log.date) &&
        log.status !== "empty",
    );
    const numericScores = weekLogs
      .map((log) => getStatusScore(log.status))
      .filter((score): score is 0 | 0.5 | 1 => score !== null);

    if (numericScores.length) {
      got += Math.max(...numericScores);
      total += 1;
      continue;
    }

    const lastDate = weekDates[weekDates.length - 1];
    if (settings.compterNonSaisisCommeManques && isIsoDatePast(lastDate)) {
      total += 1;
    }
  }

  return { got, total };
}

function scoreHabitsAcrossDates(
  habits: Habit[],
  logs: HabitLog[],
  dates: string[],
  settings: UserSettings,
) {
  const activeHabits = habits.filter((habit) => habit.active);
  const logIndex = buildLogIndex(logs);
  let got = 0;
  let total = 0;

  for (const habit of activeHabits) {
    if (habit.frequence === "hebdomadaire") {
      const weekly = weeklyScoreForPeriod(habit, logs, dates, settings);
      got += weekly.got;
      total += weekly.total;
      continue;
    }

    for (const date of dates) {
      if (!habitExistsOnDate(habit, date)) continue;
      const status = logFor(logIndex, habit.id, date);
      const score = getStatusScore(
        status,
        settings.compterNonSaisisCommeManques,
        isIsoDatePast(date),
      );
      if (score !== null) {
        got += score;
        total += 1;
      }
    }
  }

  return { got, total, score: total ? Math.round((got / total) * 100) : 0 };
}

export function calculateDayScore(
  habits: Habit[],
  logs: HabitLog[],
  date: string,
  settings: UserSettings,
) {
  const logIndex = buildLogIndex(logs);
  let got = 0;
  let total = 0;

  for (const habit of habits.filter(
    (item) => item.active && habitExistsOnDate(item, date),
  )) {
    const status = logFor(logIndex, habit.id, date);
    const hasExplicitLog = status !== "empty";

    if (habit.frequence === "hebdomadaire" && !hasExplicitLog) continue;

    const score = getStatusScore(
      status,
      settings.compterNonSaisisCommeManques &&
        habit.frequence === "quotidienne",
      isIsoDatePast(date),
    );
    if (score !== null) {
      got += score;
      total += 1;
    }
  }

  return total ? Math.round((got / total) * 100) : 0;
}

export function calculateSuccessRate(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  const ids = new Set(habits.map((habit) => habit.id));
  return scoreExplicitLogs(
    logs.filter((log) => ids.has(log.habitId)),
    settings,
  ).score;
}

export function calculateMonthScore(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  month: number,
  settings: UserSettings,
) {
  const today = formatLocalIso(new Date());
  const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endOfMonth = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth(year, month)).padStart(2, "0")}`;
  if (compareIsoDates(start, today) > 0) return 0;
  const end = compareIsoDates(endOfMonth, today) > 0 ? today : endOfMonth;
  return scoreHabitsAcrossDates(
    habits,
    logs,
    iterateIsoDates(start, end),
    settings,
  ).score;
}

export function calculateHabitMonthScore(
  habit: Habit,
  logs: HabitLog[],
  year: number,
  month: number,
  settings: UserSettings,
) {
  return calculateMonthScore([habit], logs, year, month, settings);
}

export function calculateYearScore(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  settings: UserSettings,
) {
  const today = new Date();
  const lastMonth = year === today.getFullYear() ? today.getMonth() : 11;
  if (year > today.getFullYear()) return 0;

  const scores: number[] = [];
  for (let month = 0; month <= lastMonth; month += 1) {
    const prefix = monthPrefix(year, month);
    const hasData = logs.some((log) => log.date.startsWith(prefix));
    if (!hasData && !settings.compterNonSaisisCommeManques) continue;
    scores.push(calculateMonthScore(habits, logs, year, month, settings));
  }

  return scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    : 0;
}

function hasAnyLogOnDate(logs: HabitLog[], date: string) {
  return logs.some((log) => log.date === date && log.status !== "empty");
}

export function calculateCurrentStreak(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  let streak = 0;
  const cursor = new Date();
  const today = formatLocalIso(cursor);

  if (!hasAnyLogOnDate(logs, today)) cursor.setDate(cursor.getDate() - 1);

  for (let index = 0; index < 365; index += 1) {
    const date = formatLocalIso(cursor);
    if (!hasAnyLogOnDate(logs, date)) break;
    if (calculateDayScore(habits, logs, date, settings) < 70) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function calculateBestStreak(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  let best = 0;
  let current = 0;
  const start = `${settings.anneeActive}-01-01`;
  const end = `${settings.anneeActive}-12-31`;

  for (const date of iterateIsoDates(start, end)) {
    if (!hasAnyLogOnDate(logs, date)) {
      current = 0;
      continue;
    }
    current =
      calculateDayScore(habits, logs, date, settings) >= 70 ? current + 1 : 0;
    best = Math.max(best, current);
  }

  return best;
}

export function calculateDisciplinedDays(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  settings: UserSettings,
) {
  let total = 0;
  for (const date of iterateIsoDates(`${year}-01-01`, `${year}-12-31`)) {
    if (
      hasAnyLogOnDate(logs, date) &&
      calculateDayScore(habits, logs, date, settings) >= 70
    ) {
      total += 1;
    }
  }
  return total;
}

export function calculateHabitMonthlyRates(
  habits: Habit[],
  logs: HabitLog[],
  year: number,
  settings: UserSettings,
) {
  return habits
    .filter((habit) => habit.active)
    .slice(0, 30)
    .map((habit) => ({
      id: habit.id,
      nom: habit.nom,
      categorie: habit.categorie,
      frequence: habit.frequence,
      values: Array.from({ length: 12 }, (_, month) => {
        const prefix = monthPrefix(year, month);
        const hasData = logs.some(
          (log) => log.habitId === habit.id && log.date.startsWith(prefix),
        );
        if (!hasData && !settings.compterNonSaisisCommeManques) return -1;
        return calculateHabitMonthScore(habit, logs, year, month, settings);
      }),
    }));
}

export function calculateCategoryStats(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
): CategoryStats[] {
  const activeHabits = habits.filter((habit) => habit.active);
  const categories = Array.from(
    new Set(activeHabits.map((habit) => habit.categorie)),
  );

  return categories.map((categorie) => {
    const categoryHabits = activeHabits.filter(
      (habit) => habit.categorie === categorie,
    );
    const categoryLogs = logs.filter((log) =>
      categoryHabits.some((habit) => habit.id === log.habitId),
    );
    return {
      categorie,
      score: calculateSuccessRate(categoryHabits, categoryLogs, settings),
      total: categoryLogs.filter((log) => log.status !== "empty").length,
    };
  });
}

export function calculateStatusStats(
  logs: HabitLog[],
  habits?: Habit[],
  settings?: UserSettings,
  year = settings?.anneeActive,
): StatusStats[] {
  const counts = new Map<HabitStatus, number>([
    ["done", 0],
    ["partial", 0],
    ["missed", 0],
    ["rest", 0],
    ["empty", 0],
  ]);

  for (const log of logs) {
    counts.set(log.status, (counts.get(log.status) ?? 0) + 1);
  }

  if (habits && settings && year && settings.compterNonSaisisCommeManques) {
    const today = formatLocalIso(new Date());
    const start = `${year}-01-01`;
    const end = compareIsoDates(`${year}-12-31`, today) > 0 ? today : `${year}-12-31`;
    const index = buildLogIndex(logs);
    let missing = 0;

    for (const habit of habits.filter(
      (item) => item.active && item.frequence === "quotidienne",
    )) {
      for (const date of iterateIsoDates(start, end)) {
        if (!habitExistsOnDate(habit, date) || !isIsoDatePast(date)) continue;
        if (logFor(index, habit.id, date) === "empty") missing += 1;
      }
    }
    counts.set("empty", missing);
  }

  return statusCycle.map((status) => ({
    status,
    label: statusLabels[status],
    value: counts.get(status) ?? 0,
  }));
}

export function calculateTopHabits(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return habits
    .filter((habit) => habit.active)
    .map((habit) => ({
      nom: habit.nom,
      score: calculateSuccessRate(
        [habit],
        logs.filter((log) => log.habitId === habit.id),
        settings,
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function calculateFragileHabits(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  return habits
    .filter((habit) => habit.active)
    .map((habit) => ({
      nom: habit.nom,
      score: calculateSuccessRate(
        [habit],
        logs.filter((log) => log.habitId === habit.id),
        settings,
      ),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);
}

export function calculateAntiProcrastinationIndex(
  habits: Habit[],
  logs: HabitLog[],
  settings: UserSettings,
) {
  const antiHabits = habits.filter(
    (habit) =>
      habit.active &&
      (["Productivité", "Anti-procrastination"].includes(habit.categorie) ||
        /prioritaire|deep work|scrolling|pénible|repoussé/i.test(habit.nom)),
  );
  const ids = new Set(antiHabits.map((habit) => habit.id));
  const antiLogs = logs.filter((log) => ids.has(log.habitId));
  const base = calculateSuccessRate(antiHabits, antiLogs, settings);
  const missed = antiLogs.filter((log) => log.status === "missed").length;
  const penalty = Math.min(15, Math.round(missed / 10));
  return Math.max(0, Math.min(100, base - penalty));
}

export function calculatePriorityDoneDays(habits: Habit[], logs: HabitLog[]) {
  const priorityIds = new Set(
    habits
      .filter(
        (habit) =>
          habit.active &&
          (habit.priorite === "haute" ||
            ["Productivité", "Anti-procrastination"].includes(habit.categorie) ||
            /prioritaire|deep work|pénible|repoussé/i.test(habit.nom)),
      )
      .map((habit) => habit.id),
  );
  return new Set(
    logs
      .filter((log) => priorityIds.has(log.habitId) && log.status === "done")
      .map((log) => log.date),
  ).size;
}

export function hasTrackedDataForMonth(logs: HabitLog[], year: number, month: number) {
  return logs.some((log) => log.date.startsWith(monthPrefix(year, month)));
}

export function getDateForLog(log: HabitLog) {
  return parseLocalIso(log.date);
}
