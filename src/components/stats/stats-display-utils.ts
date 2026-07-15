import { AppTheme } from "../../themes/theme-types";
import type {
  CategoryStats,
  MonthlyScore,
  StatusStats,
} from "../../analytics/tracker-analytics";
import { getScoreBand, getScoreColor } from "../charts/chart-theme-utils";

export type { MonthlyScore } from "../../analytics/tracker-analytics";

export function strongestMonth(monthly: MonthlyScore[]) {
  return monthly
    .filter((item): item is MonthlyScore & { score: number } => item.score !== null)
    .reduce<(MonthlyScore & { score: number }) | undefined>(
      (best, item) => (!best || item.score > best.score ? item : best),
      undefined,
    );
}

export function fragileMonth(monthly: MonthlyScore[]) {
  return monthly
    .filter((item): item is MonthlyScore & { score: number } => item.score !== null)
    .reduce<(MonthlyScore & { score: number }) | undefined>(
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

export function scoreColor(theme: AppTheme, score: number | null) {
  return score === null ? theme.charts.status.empty : getScoreColor(theme, score);
}

export function scoreBadge(theme: AppTheme, score: number) {
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
];

export function softColor(color: string) {
  return `color-mix(in srgb, ${color} 16%, transparent)`;
}
