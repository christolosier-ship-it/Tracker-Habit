import { createCharts, defineTheme } from "../define-theme";

export const liquidGradientFutureTheme = defineTheme({
  id: "liquid-gradient-future",
  name: "Liquid Gradient Future",
  description: "Fluide, futuriste et intensément coloré.",
  personality: "Dégradés liquides cyan, violet, rose et bleu.",
  previewEmoji: "🌀",
  tokens: {
    background: "#12103A", backgroundAlt: "#2E1B7A", surface: "rgba(255,255,255,0.14)", surfaceSoft: "rgba(255,255,255,0.09)", surfaceStrong: "rgba(255,255,255,0.22)",
    text: "#F8FAFF", textMuted: "#C9D4FF", primary: "#38BDF8", primarySoft: "rgba(56,189,248,.20)", secondary: "#A855F7",
    accent: "#F472B6", accent2: "#22D3EE", success: "#34D399", warning: "#FBBF24", danger: "#FB7185",
    border: "rgba(255,255,255,0.22)", shadow: "0 28px 90px rgba(56,189,248,.20)", glow: "rgba(244,114,182,.38)",
  },
  identity: { typography: "future-rounded", navigation: {}, cells: { variant: "liquid-bubble" } },
  charts: createCharts({
    hexPalette: ["#38BDF8", "#A855F7", "#F472B6", "#22D3EE", "#34D399"],
    status: { done: "#34D399", partial: "#FBBF24", missed: "#FB7185", rest: "#38BDF8", empty: "rgba(255,255,255,.22)" },
    visual: { strokeWidth: 12, cornerRadius: 18, grid: "soft", donutVariant: "glass", barVariant: "rounded" },
  }),
  radius: { card: "30px", button: "18px", pill: "999px" },
  effects: { backgroundStyle: "liquid", pixel: false },
});
