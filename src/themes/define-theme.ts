import {
  AppTheme,
  ChartCategoryName,
  ThemeCharts,
} from "./theme-types";

const categories: ChartCategoryName[] = [
  "Routine",
  "Santé",
  "Productivité",
  "Anti-procrastination",
  "Maison",
  "Famille",
  "Développement",
  "Finances",
  "Projet perso",
  "Autre",
];

export type ChartSeed = {
  hexPalette: string[];
  status: ThemeCharts["status"];
  score?: Partial<ThemeCharts["score"]>;
  visual: ThemeCharts["visual"];
};

export function createCharts({
  hexPalette,
  status,
  score,
  visual,
}: ChartSeed): ThemeCharts {
  return {
    hexPalette,
    status,
    score: {
      low: score?.low ?? status.missed,
      mid: score?.mid ?? status.partial,
      good: score?.good ?? status.done,
      great: score?.great ?? hexPalette[0],
    },
    category: categories.reduce(
      (accumulator, category, index) => ({
        ...accumulator,
        [category]: hexPalette[index % hexPalette.length],
      }),
      {} as Record<ChartCategoryName, string>,
    ),
    gradients: {
      progressFrom: hexPalette[0],
      progressTo: hexPalette[1] ?? hexPalette[0],
      dangerFrom: status.missed,
      dangerTo: hexPalette[2] ?? status.partial,
      neutralFrom: status.empty,
      neutralTo: status.rest,
    },
    visual,
  };
}

export function defineTheme(theme: AppTheme): AppTheme {
  return theme;
}
