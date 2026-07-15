import { createCharts, defineTheme } from "../define-theme";

export const comicBookEnergyTheme = defineTheme({
  id: "comic-book-energy",
  name: "Comic Book Energy",
  description: "Fais passer ta vie au niveau supérieur.",
  personality: "Pop art, trames, bulles et action.",
  previewEmoji: "💬",
  tokens: {
    background: "#FFE8D6", backgroundAlt: "#FFD500", surface: "#FFF8E8", surfaceSoft: "#FFEBC2", surfaceStrong: "#FFD500",
    text: "#111111", textMuted: "#4B362D", primary: "#EF233C", primarySoft: "#FFD1D6", secondary: "#FFD500",
    accent: "#0077FF", accent2: "#06D6A0", success: "#06D6A0", warning: "#FFD500", danger: "#EF233C",
    border: "#111111", shadow: "7px 7px 0 #111111", glow: "rgba(239,35,60,.28)",
  },
  identity: { typography: "comic-display", navigation: {}, cells: { variant: "comic-token" } },
  charts: createCharts({
    hexPalette: ["#EF233C", "#FFD500", "#0077FF", "#06D6A0", "#FF7A00"],
    status: { done: "#06D6A0", partial: "#FFD500", missed: "#EF233C", rest: "#0077FF", empty: "#F2D6B8" },
    visual: { strokeWidth: 14, cornerRadius: 10, grid: "comic", donutVariant: "comic", barVariant: "comic" },
  }),
  radius: { card: "16px", button: "12px", pill: "999px" },
  effects: { backgroundStyle: "comic", pixel: false },
});
