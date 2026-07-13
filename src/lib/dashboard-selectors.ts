import { AppData } from "./storage";
import { monthShortLabels } from "../app/constants";
import * as S from "./stats";
import { formatLocalIso } from "./date-utils";

export function selectDashboardStats(data: AppData) {
  const { habits, logs, settings } = data;
  const themeIndependent = {
    scoreGlobal: S.calculateYearScore(habits, logs, settings.anneeActive, settings),
    todayScore: S.calculateDayScore(
      habits,
      logs,
      formatLocalIso(new Date()),
      settings,
    ),
    currentMonth: S.calculateMonthScore(
      habits,
      logs,
      settings.anneeActive,
      settings.moisActif,
      settings,
    ),
    success: S.calculateSuccessRate(habits, logs, settings),
    anti: S.calculateAntiProcrastinationIndex(habits, logs, settings),
    disciplinedDays: S.calculateDisciplinedDays(
      habits,
      logs,
      settings.anneeActive,
      settings,
    ),
    currentStreak: S.calculateCurrentStreak(habits, logs, settings),
    bestStreak: S.calculateBestStreak(habits, logs, settings),
    doneLogs: logs.filter((log) => log.status === "done").length,
    activeHabits: habits.filter((habit) => habit.active).length,
  };

  return {
    ...themeIndependent,
    monthly: monthShortLabels.map((label, month) => ({
      mois: label,
      score: S.calculateMonthScore(
        habits,
        logs,
        settings.anneeActive,
        month,
        settings,
      ),
    })),
    antiMonthly: monthShortLabels.map((label, month) => ({
      mois: label,
      anti: S.calculateAntiProcrastinationIndex(
        habits,
        logs.filter((log) =>
          log.date.startsWith(
            `${settings.anneeActive}-${String(month + 1).padStart(2, "0")}`,
          ),
        ),
        settings,
      ),
    })),
    categoryStats: S.calculateCategoryStats(habits, logs, settings),
    statusStats: S.calculateStatusStats(
      logs,
      habits,
      settings,
      settings.anneeActive,
    ),
    topHabits: S.calculateTopHabits(habits, logs, settings),
    fragileHabits: S.calculateFragileHabits(habits, logs, settings),
    annualRates: S.calculateHabitMonthlyRates(
      habits,
      logs,
      settings.anneeActive,
      settings,
    ),
    priorityDays: S.calculatePriorityDoneDays(habits, logs),
  };
}

export type DashboardStats = ReturnType<typeof selectDashboardStats>;
