import { CategoryStats, Habit, HabitLog, HabitStatus, StatusStats, UserSettings } from '../types';

const scoreMap: Record<HabitStatus, number | null> = {
  done: 1,
  partial: 0.5,
  missed: 0,
  rest: null,
  empty: null,
};

export const statusLabels: Record<HabitStatus, string> = {
  empty: 'Non saisi',
  done: 'Accompli',
  partial: 'Partiel',
  missed: 'Manqué',
  rest: 'Repos',
};

export const statusCycle: HabitStatus[] = ['empty', 'done', 'partial', 'missed', 'rest'];

export function getStatusScore(status: HabitStatus, countEmpty = false, past = false) {
  if (status === 'empty' && countEmpty && past) return 0;
  return scoreMap[status];
}

export function logFor(logs: HabitLog[], habitId: string, date: string): HabitStatus {
  return logs.find((log) => log.habitId === habitId && log.date === date)?.status ?? 'empty';
}

export function setLog(logs: HabitLog[], habitId: string, date: string, status: HabitStatus) {
  const index = logs.findIndex((log) => log.habitId === habitId && log.date === date);
  if (index >= 0) {
    const next = [...logs];
    next[index] = { habitId, date, status };
    return next;
  }
  return [...logs, { habitId, date, status }];
}

const isPast = (date: string) => new Date(`${date}T23:59:59`) < new Date();
const monthPrefix = (year: number, month: number) => `${year}-${String(month + 1).padStart(2, '0')}`;
const activeIds = (habits: Habit[]) => new Set(habits.filter((habit) => habit.active).map((habit) => habit.id));

function scoreFromLogs(logs: HabitLog[], settings: UserSettings) {
  let got = 0;
  let total = 0;

  for (const log of logs) {
    const score = getStatusScore(log.status, settings.compterNonSaisisCommeManques, isPast(log.date));
    if (score !== null) {
      got += score;
      total += 1;
    }
  }

  return { got, total, score: total ? Math.round((got / total) * 100) : 0 };
}

export function calculateDayScore(habits: Habit[], logs: HabitLog[], date: string, settings: UserSettings) {
  let got = 0;
  let total = 0;

  for (const habit of habits.filter((item) => item.active)) {
    const status = logFor(logs, habit.id, date);
    const score = getStatusScore(status, settings.compterNonSaisisCommeManques, isPast(date));
    if (score !== null) {
      got += score;
      total += 1;
    }
  }

  return total ? Math.round((got / total) * 100) : 0;
}

export function calculateSuccessRate(habits: Habit[], logs: HabitLog[], settings: UserSettings) {
  const ids = new Set(habits.map((habit) => habit.id));
  return scoreFromLogs(logs.filter((log) => ids.has(log.habitId)), settings).score;
}

export function calculateMonthScore(habits: Habit[], logs: HabitLog[], year: number, month: number, settings: UserSettings) {
  const ids = activeIds(habits);
  const prefix = monthPrefix(year, month);
  const monthLogs = logs.filter((log) => ids.has(log.habitId) && log.date.startsWith(prefix));
  return scoreFromLogs(monthLogs, settings).score;
}

export function calculateYearScore(habits: Habit[], logs: HabitLog[], year: number, settings: UserSettings) {
  const monthScores = Array.from({ length: 12 }, (_, month) => {
    const prefix = monthPrefix(year, month);
    const hasData = logs.some((log) => log.date.startsWith(prefix));
    return hasData ? calculateMonthScore(habits, logs, year, month, settings) : null;
  }).filter((score): score is number => score !== null);

  return monthScores.length ? Math.round(monthScores.reduce((total, score) => total + score, 0) / monthScores.length) : 0;
}

export function calculateCurrentStreak(habits: Habit[], logs: HabitLog[], settings: UserSettings) {
  let streak = 0;
  const day = new Date();

  for (let index = 0; index < 365; index += 1) {
    const date = day.toISOString().slice(0, 10);
    if (calculateDayScore(habits, logs, date, settings) >= 70) streak += 1;
    else break;
    day.setDate(day.getDate() - 1);
  }

  return streak;
}

export function calculateBestStreak(habits: Habit[], logs: HabitLog[], settings: UserSettings) {
  let best = 0;
  let current = 0;
  const day = new Date(settings.anneeActive, 0, 1);
  const end = new Date(settings.anneeActive, 11, 31);

  while (day <= end) {
    const date = day.toISOString().slice(0, 10);
    current = calculateDayScore(habits, logs, date, settings) >= 70 ? current + 1 : 0;
    best = Math.max(best, current);
    day.setDate(day.getDate() + 1);
  }

  return best;
}

export function calculateDisciplinedDays(habits: Habit[], logs: HabitLog[], year: number, settings: UserSettings) {
  let total = 0;
  for (let month = 0; month < 12; month += 1) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasLogs = logs.some((log) => log.date === date);
      if (hasLogs && calculateDayScore(habits, logs, date, settings) >= 70) total += 1;
    }
  }
  return total;
}

export function calculateHabitMonthlyRates(habits: Habit[], logs: HabitLog[], year: number, settings: UserSettings) {
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
        const habitLogs = logs.filter((log) => log.habitId === habit.id && log.date.startsWith(prefix));
        if (!habitLogs.length) return -1;
        return scoreFromLogs(habitLogs, settings).score;
      }),
    }));
}

export function calculateCategoryStats(habits: Habit[], logs: HabitLog[], settings: UserSettings): CategoryStats[] {
  const activeHabits = habits.filter((habit) => habit.active);
  const categories = Array.from(new Set(activeHabits.map((habit) => habit.categorie)));

  return categories.map((categorie) => {
    const categoryHabits = activeHabits.filter((habit) => habit.categorie === categorie);
    const ids = new Set(categoryHabits.map((habit) => habit.id));
    const categoryLogs = logs.filter((log) => ids.has(log.habitId));
    return {
      categorie,
      score: calculateSuccessRate(categoryHabits, categoryLogs, settings),
      total: categoryLogs.length,
    };
  });
}

export function calculateStatusStats(logs: HabitLog[]): StatusStats[] {
  return (['done', 'partial', 'missed', 'rest', 'empty'] as HabitStatus[]).map((status) => ({
    status,
    label: statusLabels[status],
    value: logs.filter((log) => log.status === status).length,
  }));
}

export function calculateTopHabits(habits: Habit[], logs: HabitLog[], settings: UserSettings) {
  return habits
    .filter((habit) => habit.active)
    .map((habit) => ({
      nom: habit.nom,
      score: calculateSuccessRate([habit], logs.filter((log) => log.habitId === habit.id), settings),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function calculateFragileHabits(habits: Habit[], logs: HabitLog[], settings: UserSettings) {
  return habits
    .filter((habit) => habit.active)
    .map((habit) => ({
      nom: habit.nom,
      score: calculateSuccessRate([habit], logs.filter((log) => log.habitId === habit.id), settings),
    }))
    .filter((habit) => habit.score > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);
}

export function calculateAntiProcrastinationIndex(habits: Habit[], logs: HabitLog[], settings: UserSettings) {
  const antiHabits = habits.filter(
    (habit) =>
      habit.active &&
      (['Productivité', 'Anti-procrastination'].includes(habit.categorie) ||
        /prioritaire|deep work|scrolling|pénible|repoussé/i.test(habit.nom)),
  );
  const ids = new Set(antiHabits.map((habit) => habit.id));
  const antiLogs = logs.filter((log) => ids.has(log.habitId));
  const base = calculateSuccessRate(antiHabits, antiLogs, settings);
  const missed = antiLogs.filter((log) => log.status === 'missed').length;
  const penalty = Math.min(15, Math.round(missed / 10));

  return Math.max(0, Math.min(100, base - penalty));
}
