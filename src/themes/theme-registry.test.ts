import { describe, expect, it } from "vitest";
import { defaultThemeId, resolveTheme, themes } from "./theme-registry";

const expectedIds = [
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
];

describe("registre des thèmes", () => {
  it("contient exactement les douze thèmes attendus sans doublon", () => {
    const ids = themes.map((theme) => theme.id);
    expect(ids).toHaveLength(12);
    expect(new Set(ids).size).toBe(12);
    expect(ids).toEqual(expectedIds);
  });

  it("fournit des palettes et variantes complètes pour chaque thème", () => {
    for (const theme of themes) {
      expect(theme.charts.hexPalette.length).toBeGreaterThanOrEqual(3);
      expect(theme.identity.navigation.variant).toBeTruthy();
      expect(theme.identity.cells.variant).toBeTruthy();
      expect(theme.identity.frame).toBeTruthy();
      expect(theme.identity.typography).toBeTruthy();
      expect(theme.tokens.background).toMatch(/^#|^rgba/);
      expect(theme.tokens.text).toMatch(/^#/);
    }
  });

  it("retombe sur le thème par défaut pour un identifiant inconnu", () => {
    expect(resolveTheme("theme-inconnu").id).toBe(defaultThemeId);
  });
});
