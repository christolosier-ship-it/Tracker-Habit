import { createCharts, defineTheme } from "../define-theme";

export const tropicalFestivalTheme = defineTheme({
  id: "tropical-festival",
  name: "Tropical Festival",
  description: "Nature vibrante, énergie solaire et régularité florissante.",
  personality: "Solaire, végétal, chaud et festival.",
  previewEmoji: "🌺",
  tokens: {
    background: "#FFF3C7", backgroundAlt: "#DDF8D8", surface: "#FFFBEA", surfaceSoft: "#E9F9D8", surfaceStrong: "#FFB703",
    text: "#104235", textMuted: "#487466", primary: "#087F5B", primarySoft: "#B7E4C7", secondary: "#FFB703",
    accent: "#F97316", accent2: "#2EC4B6", success: "#2F9E44", warning: "#FFD43B", danger: "#FF6B6B",
    border: "#B7E4C7", shadow: "0 22px 60px rgba(8,127,91,.18)", glow: "rgba(249,115,22,.32)",
  },
  identity: { typography: "organic", navigation: {}, cells: { variant: "tropical-seed" } },
  charts: createCharts({
    hexPalette: ["#087F5B", "#FFB703", "#F97316", "#2EC4B6", "#7BC950"],
    status: { done: "#2F9E44", partial: "#FFD43B", missed: "#FF6B6B", rest: "#2EC4B6", empty: "#D9E8BC" },
    visual: { strokeWidth: 14, cornerRadius: 18, grid: "soft", donutVariant: "soft", barVariant: "rounded" },
  }),
  radius: { card: "28px", button: "999px", pill: "999px" },
  effects: { backgroundStyle: "tropical", pixel: false },
});
