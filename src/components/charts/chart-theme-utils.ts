import { AppTheme, ChartCategoryName } from "../../themes/theme-types";
import { HabitStatus } from "../../types";

export type ChartVariant =
  | "score"
  | "status"
  | "category"
  | "fragile"
  | "streak"
  | "antiProcrastination"
  | "topHabits";

type ScoreBand = keyof AppTheme["charts"]["score"];

export const statusOrder: HabitStatus[] = [
  "done",
  "partial",
  "missed",
  "rest",
  "empty",
];

export function getStatusColor(theme: AppTheme, status: HabitStatus) {
  return theme.charts.status[status];
}

export function getStatusChartColors(theme: AppTheme) {
  return statusOrder.map((status) => theme.charts.status[status]);
}

export function getCategoryColor(theme: AppTheme, category: string) {
  return (
    theme.charts.category[category as ChartCategoryName] ??
    theme.charts.hexPalette[0]
  );
}

export function getScoreBand(score: number): ScoreBand {
  if (score < 45) return "low";
  if (score < 65) return "mid";
  if (score < 85) return "good";
  return "great";
}

export function getScoreColor(theme: AppTheme, score: number) {
  return theme.charts.score[getScoreBand(score)];
}

export function getChartPalette(theme: AppTheme, variant: ChartVariant) {
  if (variant === "status") return getStatusChartColors(theme);
  if (variant === "fragile") {
    return [theme.charts.status.missed, theme.charts.gradients.dangerTo];
  }
  if (variant === "antiProcrastination") {
    return [
      theme.charts.hexPalette[1],
      theme.charts.hexPalette[2],
      theme.charts.status.done,
    ];
  }
  if (variant === "topHabits" || variant === "streak") {
    return [theme.charts.status.done, theme.charts.gradients.progressTo];
  }
  return theme.charts.hexPalette;
}

export function chartCssVars(theme: AppTheme, variant: ChartVariant) {
  const palette = getChartPalette(theme, variant);
  return {
    "--chart-primary": palette[0],
    "--chart-secondary": palette[1] ?? palette[0],
    "--chart-tertiary": palette[2] ?? palette[0],
    "--chart-radius": `${theme.charts.visual.cornerRadius}px`,
    "--chart-stroke": `${theme.charts.visual.strokeWidth}px`,
  } as React.CSSProperties;
}
