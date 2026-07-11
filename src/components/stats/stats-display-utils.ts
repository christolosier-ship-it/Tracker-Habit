import { AppTheme } from "../../themes/theme-types";
import { CategoryStats, StatusStats } from "../../types";

export type MonthlyScore = { mois: string; score: number };

export function strongestMonth(monthly: MonthlyScore[]) {
  return monthly.reduce<MonthlyScore | undefined>(
    (best, item) => (!best || item.score > best.score ? item : best),
    undefined,
  );
}

export function fragileMonth(monthly: MonthlyScore[]) {
  return monthly
    .filter((item) => item.score > 0)
    .reduce<
      MonthlyScore | undefined
    >((fragile, item) => (!fragile || item.score < fragile.score ? item : fragile), undefined);
}

export function strongestCategory(categoryStats: CategoryStats[]) {
  return categoryStats.reduce<CategoryStats | undefined>(
    (best, item) => (!best || item.score > best.score ? item : best),
    undefined,
  );
}

export function fragileCategory(categoryStats: CategoryStats[]) {
  return categoryStats
    .filter((item) => item.score > 0)
    .reduce<
      CategoryStats | undefined
    >((fragile, item) => (!fragile || item.score < fragile.score ? item : fragile), undefined);
}

export function scoreColor(theme: AppTheme, score: number) {
  if (score === 0) return theme.charts.status.empty;
  if (score < 45) return theme.charts.score.low;
  if (score < 65) return theme.charts.score.mid;
  if (score < 85) return theme.charts.score.good;
  return theme.charts.score.great;
}

export function scoreBadge(theme: AppTheme, score: number) {
  if (score === 0)
    return { label: "À lancer", color: theme.charts.status.empty };
  if (score >= 85)
    return { label: "Excellent", color: theme.charts.score.great };
  if (score >= 65) return { label: "Solide", color: theme.charts.score.good };
  if (score >= 45)
    return { label: "À stabiliser", color: theme.charts.score.mid };
  return { label: "Fragile", color: theme.charts.score.low };
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
