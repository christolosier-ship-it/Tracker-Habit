import { createCharts, defineTheme } from "../define-theme";

export const editorialFashionTechTheme = defineTheme({
  id: "editorial-fashion-tech",
  name: "Editorial Fashion Tech",
  description: "Discipline is the new luxury.",
  personality: "Noir, or, luxe éditorial et magazine.",
  previewEmoji: "🥂",
  tokens: {
    background: "#090806", backgroundAlt: "#17130D", surface: "#15120E", surfaceSoft: "#201A12", surfaceStrong: "#2A210F",
    text: "#F8EFD9", textMuted: "#BDAF8C", primary: "#C9A227", primarySoft: "rgba(201,162,39,.18)", secondary: "#846A2D",
    accent: "#F5D76E", accent2: "#FFFFFF", success: "#D6B85A", warning: "#F5C542", danger: "#B23B3B",
    border: "rgba(245,215,110,0.28)", shadow: "0 30px 90px rgba(0,0,0,.55)", glow: "rgba(245,215,110,.22)",
  },
  identity: { typography: "editorial-serif", navigation: {}, cells: { variant: "gold-dot" } },
  charts: createCharts({
    hexPalette: ["#C9A227", "#F5D76E", "#846A2D", "#D6B85A", "#B23B3B"],
    status: { done: "#D6B85A", partial: "#F5C542", missed: "#B23B3B", rest: "#846A2D", empty: "#3A3326" },
    visual: { strokeWidth: 8, cornerRadius: 3, grid: "none", donutVariant: "luxury", barVariant: "luxury" },
  }),
  radius: { card: "4px", button: "2px", pill: "999px" },
  effects: { backgroundStyle: "editorial", pixel: false },
});
