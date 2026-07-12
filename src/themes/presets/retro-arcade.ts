import { createCharts, defineTheme } from "../define-theme";

export const retroArcadeTheme = defineTheme({
  id: "retro-arcade",
  name: "Retro Arcade",
  shortName: "Arcade",
  description: "Level up your habits. 8-bit your life.",
  personality: "Gaming, pixel, XP, streaks et quêtes.",
  previewEmoji: "👾",
  tokens: {
    background: "#12071F", backgroundAlt: "#260A44", surface: "#1B0B35", surfaceSoft: "#2A1155", surfaceStrong: "#3B1680",
    text: "#F7ECFF", textMuted: "#BDA5D6", primary: "#FF2BD6", primarySoft: "rgba(255,43,214,.18)", secondary: "#00F5D4",
    accent: "#FEE440", accent2: "#9B5DE5", success: "#00FF85", warning: "#FEE440", danger: "#FF3864",
    border: "#6D28D9", shadow: "0 0 0 2px #6D28D9, 0 0 30px rgba(255,43,214,.18)", glow: "rgba(255,43,214,.45)",
  },
  identity: { typography: "pixel", frame: "pixel", navigation: { variant: "arcade", compactLabels: true, showDecorativeStatus: true }, cells: { variant: "pixel-tile" } },
  charts: createCharts({
    hexPalette: ["#FF2BD6", "#00F5D4", "#FEE440", "#9B5DE5", "#00FF85"],
    status: { done: "#00FF85", partial: "#FEE440", missed: "#FF3864", rest: "#00F5D4", empty: "#3B1680" },
    visual: { strokeWidth: 10, cornerRadius: 2, grid: "pixel", donutVariant: "pixel", barVariant: "pixel", heatmapVariant: "pixel-blocks" },
  }),
  radius: { card: "10px", button: "6px", pill: "4px" },
  effects: { backgroundStyle: "arcade", glass: false, glow: true, pattern: true, stickers: false, highContrast: false, pixel: true, comic: false },
});
