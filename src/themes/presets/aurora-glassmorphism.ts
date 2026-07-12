import { createCharts, defineTheme } from "../define-theme";

export const auroraGlassmorphismTheme = defineTheme({
  id: "aurora-glassmorphism",
  name: "Aurora Glassmorphism",
  shortName: "Aurora",
  description: "Soft glass. Fluid gradients. Dreamy focus.",
  personality: "Verre doux, gradients fluides, focus onirique.",
  previewEmoji: "🫧",
  tokens: {
    background: "#1C1B4B", backgroundAlt: "#2D2B72", surface: "rgba(255,255,255,0.16)", surfaceSoft: "rgba(255,255,255,0.10)", surfaceStrong: "rgba(255,255,255,0.25)",
    text: "#F8F7FF", textMuted: "#D8D3F7", primary: "#A78BFA", primarySoft: "rgba(167,139,250,.22)", secondary: "#67E8F9",
    accent: "#F9A8D4", accent2: "#C4B5FD", success: "#5EEAD4", warning: "#FDE68A", danger: "#FDA4AF",
    border: "rgba(255,255,255,0.24)", shadow: "0 28px 80px rgba(103,232,249,.16)", glow: "rgba(249,168,212,.38)",
  },
  identity: { typography: "soft-modern", frame: "glass", navigation: { variant: "glass", compactLabels: false, showDecorativeStatus: false }, cells: { variant: "glass-tile" } },
  charts: createCharts({
    hexPalette: ["#A78BFA", "#67E8F9", "#F9A8D4", "#C4B5FD", "#5EEAD4"],
    status: { done: "#5EEAD4", partial: "#FDE68A", missed: "#FDA4AF", rest: "#67E8F9", empty: "rgba(255,255,255,.25)" },
    visual: { strokeWidth: 11, cornerRadius: 16, grid: "soft", donutVariant: "glass", barVariant: "rounded", heatmapVariant: "glass-pills" },
  }),
  radius: { card: "30px", button: "18px", pill: "999px" },
  effects: { backgroundStyle: "aurora", glass: true, glow: true, pattern: false, stickers: false, highContrast: false, pixel: false, comic: false },
});
