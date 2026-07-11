export type ThemeId =
  | "dopamine-pop"
  | "neon-cyberpunk-matrix"
  | "memphis-productivity"
  | "aurora-glassmorphism"
  | "tropical-festival"
  | "retro-arcade"
  | "cosmic-dreamscape"
  | "kawaii-maximalist"
  | "brutalist-color-clash"
  | "editorial-fashion-tech"
  | "comic-book-energy"
  | "liquid-gradient-future";

export type ChartCategoryName =
  | "Routine"
  | "Santé"
  | "Productivité"
  | "Anti-procrastination"
  | "Maison"
  | "Famille"
  | "Développement"
  | "Finances"
  | "Projet perso"
  | "Autre";

export type ThemeCharts = {
  tremorPalette: string[];
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
    donutVariant:
      | "soft"
      | "neon"
      | "glass"
      | "solid"
      | "pixel"
      | "comic"
      | "luxury";
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
  radius: { card: string; button: string; pill: string };
  effects: {
    backgroundStyle:
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
    glass: boolean;
    glow: boolean;
    pattern: boolean;
    stickers: boolean;
    highContrast: boolean;
    pixel: boolean;
    comic: boolean;
  };
};
