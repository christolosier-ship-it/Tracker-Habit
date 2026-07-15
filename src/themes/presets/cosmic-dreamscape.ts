import { createCharts, defineTheme } from "../define-theme";

export const cosmicDreamscapeTheme = defineTheme({
  id: "cosmic-dreamscape",
  name: "Cosmic Dreamscape",
  description: "Tes habitudes s’écrivent dans les étoiles.",
  personality: "Galaxie, rêve, indigo, violet et rose.",
  previewEmoji: "🪐",
  tokens: {
    background: "#08051A", backgroundAlt: "#1B0D3A", surface: "#130C2E", surfaceSoft: "#211449", surfaceStrong: "#2E1B68",
    text: "#F4EEFF", textMuted: "#C9B9E8", primary: "#8B5CF6", primarySoft: "rgba(139,92,246,.18)", secondary: "#EC4899",
    accent: "#22D3EE", accent2: "#F472B6", success: "#A3E635", warning: "#FBBF24", danger: "#FB7185",
    border: "rgba(139,92,246,0.35)", shadow: "0 24px 70px rgba(139,92,246,.24)", glow: "rgba(236,72,153,.4)",
  },
  identity: { typography: "cosmic-serif", navigation: {}, cells: { variant: "star-orbit" } },
  charts: createCharts({
    hexPalette: ["#8B5CF6", "#EC4899", "#22D3EE", "#A3E635", "#FBBF24"],
    status: { done: "#A3E635", partial: "#FBBF24", missed: "#FB7185", rest: "#22D3EE", empty: "#2E1B68" },
    visual: { strokeWidth: 11, cornerRadius: 14, grid: "soft", donutVariant: "neon", barVariant: "rounded" },
  }),
  radius: { card: "26px", button: "999px", pill: "999px" },
  effects: { backgroundStyle: "cosmic", pixel: false },
});
