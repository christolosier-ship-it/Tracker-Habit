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


export type ThemeIdentityVariant =
  | "neon-hud" | "dopamine-candy" | "memphis-blocks" | "aurora-glass"
  | "tropical-botanical" | "arcade-hud" | "cosmic-orbit" | "kawaii-party"
  | "brutalist-control" | "editorial-luxury" | "comic-missions" | "liquid-future";

export type ThemeTypographyVariant =
  | "terminal" | "friendly-rounded" | "bold-geometric" | "soft-modern" | "organic" | "pixel"
  | "cosmic-serif" | "kawaii-rounded" | "brutalist-condensed" | "editorial-serif"
  | "comic-display" | "future-rounded";

export type ThemeFrameVariant =
  | "hud" | "candy" | "memphis" | "glass" | "botanical" | "pixel" | "orbit"
  | "sticker" | "brutalist" | "editorial" | "comic" | "liquid";

export type ThemeWidgetVariant =
  | "system-status" | "mood-bubble" | "shape-score" | "aurora-focus" | "growth-bloom"
  | "player-hud" | "orbit-score" | "reward-collection" | "control-manifesto"
  | "editorial-quote" | "hero-mission" | "flow-score";

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

  identity: {
    variant: ThemeIdentityVariant;
    typography: ThemeTypographyVariant;
    frame: ThemeFrameVariant;
    signatureWidget: ThemeWidgetVariant;
    navigation: {
      variant: "terminal" | "candy" | "color-block" | "glass" | "botanical" | "arcade" | "cosmic" | "kawaii" | "brutalist" | "editorial" | "comic" | "liquid";
      compactLabels: boolean;
      showDecorativeStatus: boolean;
    };
    hero: {
      variant: "hud" | "welcome" | "poster" | "glass" | "festival" | "player" | "cosmic" | "party" | "control" | "editorial" | "comic" | "future";
      eyebrow: string;
      slogan: string;
      decorativeLabel: string;
    };
    decoration: {
      variant: "circuit" | "confetti" | "memphis" | "aurora" | "leaves" | "pixels" | "stars" | "stickers" | "color-clash" | "fine-lines" | "halftone" | "liquid-blobs";
      density: "low" | "medium" | "high";
    };
    cells: {
      variant: "neon-square" | "candy-dot" | "memphis-shape" | "glass-tile" | "tropical-seed" | "pixel-tile" | "star-orbit" | "kawaii-sticker" | "brutal-block" | "gold-dot" | "comic-token" | "liquid-bubble";
    };
    badges: {
      variant: "terminal" | "pill" | "outlined" | "glass" | "leaf" | "pixel" | "cosmic" | "sticker" | "block" | "luxury" | "comic" | "liquid";
    };
  };
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
