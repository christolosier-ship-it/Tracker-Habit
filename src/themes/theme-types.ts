import type { HabitCategory } from "../domain/definitions";
import type { ThemeId } from "./theme-ids";

export type { ThemeId } from "./theme-ids";

type ThemeTypographyVariant =
  | "terminal"
  | "friendly-rounded"
  | "bold-geometric"
  | "soft-modern"
  | "organic"
  | "pixel"
  | "cosmic-serif"
  | "kawaii-rounded"
  | "brutalist-condensed"
  | "editorial-serif"
  | "comic-display"
  | "future-rounded";

type ThemeCellVariant =
  | "neon-square"
  | "candy-dot"
  | "memphis-shape"
  | "glass-tile"
  | "tropical-seed"
  | "pixel-tile"
  | "star-orbit"
  | "kawaii-sticker"
  | "brutal-block"
  | "gold-dot"
  | "comic-token"
  | "liquid-bubble";

type ThemeStyle =
  | "pop"
  | "neon"
  | "memphis"
  | "aurora"
  | "tropical"
  | "arcade"
  | "cosmic"
  | "kawaii"
  | "brutalist"
  | "editorial"
  | "comic"
  | "liquid";

export type ChartCategoryName = HabitCategory;

export type ThemeCharts = {
  hexPalette: string[];
  status: {
    done: string;
    partial: string;
    missed: string;
    rest: string;
    empty: string;
  };
  score: { low: string; mid: string; good: string; great: string };
  category: Record<ChartCategoryName, string>;
  gradients: {
    progressTo: string;
    dangerTo: string;
  };
  visual: {
    strokeWidth: number;
    cornerRadius: number;
    grid: "soft" | "visible" | "none" | "pixel" | "comic";
    donutVariant: "soft" | "neon" | "glass" | "solid" | "pixel" | "comic" | "luxury";
    barVariant: "rounded" | "block" | "pixel" | "comic" | "luxury";
  };
};

export type AppTheme = {
  id: ThemeId;
  name: string;
  description: string;
  personality: string;
  previewEmoji: string;
  tokens: {
    background: string;
    backgroundAlt: string;
    surface: string;
    surfaceSoft: string;
    surfaceStrong: string;
    text: string;
    textMuted: string;
    primary: string;
    primarySoft: string;
    secondary: string;
    accent: string;
    accent2: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    shadow: string;
    glow: string;
  };
  charts: ThemeCharts;
  identity: {
    typography: ThemeTypographyVariant;
    navigation: {
      status?: "terminal" | "arcade";
    };
    cells: { variant: ThemeCellVariant };
  };
  radius: { card: string; button: string; pill: string };
  effects: {
    backgroundStyle: ThemeStyle;
    pixel: boolean;
  };
};
