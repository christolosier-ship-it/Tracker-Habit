import { AppTheme } from "../../themes/theme-types";
import { CategoryStats, StatusStats } from "../../types";
import { getScoreBand, getScoreColor } from "../charts/chart-theme-utils";

export type MonthlyScore = { mois: string; score: number };

export function strongestMonth(monthly: MonthlyScore[]) {
  return monthly
    .filter((item) => item.score > 0)
    .reduce<MonthlyScore | undefined>(
      (best, item) => (!best || item.score > best.score ? item : best),
      undefined,
    );
}

export function fragileMonth(monthly: MonthlyScore[]) {
  return monthly
    .filter((item) => item.score > 0)
    .reduce<MonthlyScore | undefined>(
      (fragile, item) => (!fragile || item.score < fragile.score ? item : fragile),
      undefined,
    );
}

export function strongestCategory(categoryStats: CategoryStats[]) {
  return categoryStats
    .filter((item) => item.total > 0)
    .reduce<CategoryStats | undefined>(
      (best, item) => (!best || item.score > best.score ? item : best),
      undefined,
    );
}

export function fragileCategory(categoryStats: CategoryStats[]) {
  return categoryStats
    .filter((item) => item.total > 0)
    .reduce<CategoryStats | undefined>(
      (fragile, item) => (!fragile || item.score < fragile.score ? item : fragile),
      undefined,
    );
}

export function scoreColor(theme: AppTheme, score: number) {
  return score === 0 ? theme.charts.status.empty : getScoreColor(theme, score);
}

export function scoreBadge(theme: AppTheme, score: number) {
  if (score === 0)
    return { label: "À lancer", color: theme.charts.status.empty };
  const band = getScoreBand(score);
  const label =
    band === "great"
      ? "Excellent"
      : band === "good"
        ? "Solide"
        : band === "mid"
          ? "À stabiliser"
          : "Fragile";
  return { label, color: theme.charts.score[band] };
}

export const statusLegendOrder: Array<{
  status: StatusStats["status"];
  label: string;
}> = [
  { status: "done", label: "Accompli" },
  { status: "partial", label: "Partiel" },
  { status: "missed", label: "Manqué" },
  { status: "rest", label: "Repos" },
  { status: "empty", label: "Non saisi" },
];

export function softColor(color: string) {
  return `color-mix(in srgb, ${color} 16%, transparent)`;
}
