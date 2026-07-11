export type ThemeId =
  | 'dopamine-pop'
  | 'neon-cyberpunk-matrix'
  | 'memphis-productivity'
  | 'aurora-glassmorphism'
  | 'tropical-festival'
  | 'retro-arcade'
  | 'cosmic-dreamscape'
  | 'kawaii-maximalist'
  | 'brutalist-color-clash'
  | 'editorial-fashion-tech'
  | 'comic-book-energy'
  | 'liquid-gradient-future';

export type AppTheme = {
  id: ThemeId;
  name: string;
  shortName: string;
  description: string;
  personality: string;
  previewEmoji: string;
  tokens: {
    background: string; backgroundAlt: string; surface: string; surfaceSoft: string; surfaceStrong: string;
    text: string; textMuted: string; primary: string; primarySoft: string; secondary: string; accent: string; accent2: string;
    success: string; warning: string; danger: string; border: string; shadow: string; glow: string;
  };
  charts: { palette: string[] };
  radius: { card: string; button: string; pill: string };
  effects: {
    backgroundStyle: 'pop'|'neon'|'memphis'|'aurora'|'tropical'|'arcade'|'cosmic'|'kawaii'|'brutalist'|'editorial'|'comic'|'liquid';
    glass: boolean; glow: boolean; pattern: boolean; stickers: boolean; highContrast: boolean; pixel: boolean; comic: boolean;
  };
};
