export const THEME_IDS = [
  "dopamine-pop",
  "neon-cyberpunk-matrix",
  "memphis-productivity",
  "aurora-glassmorphism",
  "tropical-festival",
  "retro-arcade",
  "cosmic-dreamscape",
  "kawaii-maximalist",
  "brutalist-color-clash",
  "editorial-fashion-tech",
  "comic-book-energy",
  "liquid-gradient-future",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME_ID: ThemeId = "dopamine-pop";
