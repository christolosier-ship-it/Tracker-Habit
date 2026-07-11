import { CSSProperties } from 'react';
import { AppTheme } from './theme-types';

export function applyThemeStyle(theme: AppTheme): CSSProperties {
  return {
    '--bg': theme.tokens.background,
    '--bg-alt': theme.tokens.backgroundAlt,
    '--surface': theme.tokens.surface,
    '--surface-soft': theme.tokens.surfaceSoft,
    '--surface-strong': theme.tokens.surfaceStrong,
    '--text': theme.tokens.text,
    '--text-muted': theme.tokens.textMuted,
    '--primary': theme.tokens.primary,
    '--primary-soft': theme.tokens.primarySoft,
    '--secondary': theme.tokens.secondary,
    '--accent': theme.tokens.accent,
    '--accent-2': theme.tokens.accent2,
    '--success': theme.tokens.success,
    '--warning': theme.tokens.warning,
    '--danger': theme.tokens.danger,
    '--border': theme.tokens.border,
    '--shadow': theme.tokens.shadow,
    '--glow': theme.tokens.glow,
    '--radius-card': theme.radius.card,
    '--radius-button': theme.radius.button,
    '--radius-pill': theme.radius.pill,
  } as CSSProperties;
}
