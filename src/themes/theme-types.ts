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

type ThemeFrameVariant =
  | "hud"
  | "candy"
  | "memphis"
  | "glass"
  | "botanical"
  | "pixel"
  | "orbit"
  | "sticker"
  | "brutalist"
  | "editorial"
  | "comic"
  | "liquid";

type ThemeNavigationVariant =
  | "terminal"
  | "candy"
  | "color-block"
  | "glass"
  | "botanical"
  | "arcade"
  | "cosmic"
  | "kawaii"
  | "brutalist"
  | "editorial"
  | "comic"
  | "liquid";

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
    progressFrom: string;
    progressTo: string;
    dangerFrom: string;
    dangerTo: string;
    neutralFrom: string;
    neutralTo: string;
  };
  visual: {
    strokeWidth: number;
    cornerRadius: number;
    grid: "soft" | "visible" | "none" | "pixel" | "comic";
    donutVariant: "soft" | "neon" | "glass" | "solid" | "pixel" | "comic" | "luxury";
    barVariant: "rounded" | "block" | "pixel" | "comic" | "luxury";
    heatmapVariant:
      | "candy-dots"
      | "neon-squares"
      | "memphis-shapes"
      | "glass-pills"
      | "tropical-seeds"
      | "pixel-blocks"
      | "cosmic-stars"
      | "kawaii-stickers"
      | "brutalist-blocks"
      | "editorial-dots"
      | "comic-badges"
      | "liquid-bubbles";
  };
};

export type AppTheme = {
  id: ThemeId;
  name: string;
  shortName: string;
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
    frame: ThemeFrameVariant;
    navigation: {
      variant: ThemeNavigationVariant;
      compactLabels: boolean;
      showDecorativeStatus: boolean;
    };
    cells: { variant: ThemeCellVariant };
  };
  radius: { card: string; button: string; pill: string };
  effects: {
    backgroundStyle: ThemeStyle;
    glass: boolean;
    glow: boolean;
    pattern: boolean;
    stickers: boolean;
    highContrast: boolean;
    pixel: boolean;
    comic: boolean;
  };
};
