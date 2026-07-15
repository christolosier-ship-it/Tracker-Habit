import { createCharts, defineTheme } from "../define-theme";

export const memphisProductivityTheme = defineTheme({
  id: "memphis-productivity",
  name: "Memphis Productivity",
  description: "Bold shapes. Quirky vibes. Get things done.",
  personality: "Graphique, formes vives, productivité pop arty.",
  previewEmoji: "🔺",
  tokens: {
    background: "#FFF8E8", backgroundAlt: "#FFE6B2", surface: "#FFFFFF", surfaceSoft: "#FFF1CC", surfaceStrong: "#FFD60A",
    text: "#111111", textMuted: "#4B4B4B", primary: "#FF3B30", primarySoft: "#FFD7D4", secondary: "#FFD60A",
    accent: "#0A84FF", accent2: "#34C759", success: "#34C759", warning: "#FF9F0A", danger: "#FF2D55",
    border: "#111111", shadow: "8px 8px 0 #111111", glow: "rgba(255,59,48,.25)",
  },
  identity: { typography: "bold-geometric", navigation: {}, cells: { variant: "memphis-shape" } },
  charts: createCharts({
    hexPalette: ["#FF3B30", "#FFD60A", "#0A84FF", "#34C759", "#FF9F0A"],
    status: { done: "#34C759", partial: "#FFD60A", missed: "#FF2D55", rest: "#0A84FF", empty: "#D7D2C6" },
    visual: { strokeWidth: 13, cornerRadius: 4, grid: "comic", donutVariant: "solid", barVariant: "comic" },
  }),
  radius: { card: "18px", button: "8px", pill: "999px" },
  effects: { backgroundStyle: "memphis", pixel: false },
});
