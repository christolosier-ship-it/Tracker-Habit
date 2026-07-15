import { AppTheme, ThemeId } from "./theme-types";
import { DEFAULT_THEME_ID } from "./theme-ids";
import { auroraGlassmorphismTheme } from "./presets/aurora-glassmorphism";
import { brutalistColorClashTheme } from "./presets/brutalist-color-clash";
import { comicBookEnergyTheme } from "./presets/comic-book-energy";
import { cosmicDreamscapeTheme } from "./presets/cosmic-dreamscape";
import { dopaminePopTheme } from "./presets/dopamine-pop";
import { editorialFashionTechTheme } from "./presets/editorial-fashion-tech";
import { kawaiiMaximalistTheme } from "./presets/kawaii-maximalist";
import { liquidGradientFutureTheme } from "./presets/liquid-gradient-future";
import { memphisProductivityTheme } from "./presets/memphis-productivity";
import { neonCyberpunkTheme } from "./presets/neon-cyberpunk";
import { retroArcadeTheme } from "./presets/retro-arcade";
import { tropicalFestivalTheme } from "./presets/tropical-festival";

export const themes: AppTheme[] = [
  dopaminePopTheme,
  neonCyberpunkTheme,
  memphisProductivityTheme,
  auroraGlassmorphismTheme,
  tropicalFestivalTheme,
  retroArcadeTheme,
  cosmicDreamscapeTheme,
  kawaiiMaximalistTheme,
  brutalistColorClashTheme,
  editorialFashionTechTheme,
  comicBookEnergyTheme,
  liquidGradientFutureTheme,
];

export const defaultThemeId: ThemeId = DEFAULT_THEME_ID;

export const themeById = Object.fromEntries(
  themes.map((theme) => [theme.id, theme]),
) as Record<ThemeId, AppTheme>;

export function resolveTheme(id?: string): AppTheme {
  return themeById[id as ThemeId] ?? themeById[defaultThemeId];
}
