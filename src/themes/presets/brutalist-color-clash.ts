import { createCharts, defineTheme } from "../define-theme";

export const brutalistColorClashTheme = defineTheme({
  id: "brutalist-color-clash",
  name: "Brutalist Color Clash",
  description: "Pas d’excuse, seulement du progrès.",
  personality: "Hot pink, cobalt, jaune acide, noir.",
  previewEmoji: "💥",
  tokens: {
    background: "#050505", backgroundAlt: "#171717", surface: "#111111", surfaceSoft: "#1A1A1A", surfaceStrong: "#FF0A7A",
    text: "#FFFFFF", textMuted: "#D0D0D0", primary: "#FF0A7A", primarySoft: "rgba(255,10,122,.22)", secondary: "#0057FF",
    accent: "#F9FF00", accent2: "#00FF94", success: "#00FF94", warning: "#F9FF00", danger: "#FF0A0A",
    border: "#FFFFFF", shadow: "10px 10px 0 #F9FF00", glow: "rgba(255,10,122,.38)",
  },
  identity: { typography: "brutalist-condensed", navigation: {}, cells: { variant: "brutal-block" } },
  charts: createCharts({
    hexPalette: ["#FF0A7A", "#0057FF", "#F9FF00", "#00FF94", "#FF0A0A"],
    status: { done: "#00FF94", partial: "#F9FF00", missed: "#FF0A0A", rest: "#0057FF", empty: "#3A3A3A" },
    visual: { strokeWidth: 18, cornerRadius: 0, grid: "visible", donutVariant: "solid", barVariant: "block" },
  }),
  radius: { card: "0px", button: "0px", pill: "0px" },
  effects: { backgroundStyle: "brutalist", pixel: false },
});
