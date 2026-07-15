import { createCharts, defineTheme } from "../define-theme";

export const kawaiiMaximalistTheme = defineTheme({
  id: "kawaii-maximalist",
  name: "Kawaii Maximalist",
  description: "Une fête pastel pour chaque habitude accomplie.",
  personality: "Pastel maximaliste, stickers, cute et joyeux.",
  previewEmoji: "🐰",
  tokens: {
    background: "#FFF0FA", backgroundAlt: "#E9F8FF", surface: "#FFFFFF", surfaceSoft: "#FFF7FD", surfaceStrong: "#FFD6E8",
    text: "#5B345B", textMuted: "#9B6F9B", primary: "#FF8ACD", primarySoft: "#FFD6E8", secondary: "#FFD6E8",
    accent: "#8BD3FF", accent2: "#FFF176", success: "#A7F3D0", warning: "#FDE68A", danger: "#FDA4AF",
    border: "#FFC4E6", shadow: "0 24px 60px rgba(255,138,205,.22)", glow: "rgba(139,211,255,.28)",
  },
  identity: { typography: "kawaii-rounded", navigation: {}, cells: { variant: "kawaii-sticker" } },
  charts: createCharts({
    hexPalette: ["#FF8ACD", "#8BD3FF", "#FFF176", "#A7F3D0", "#FDA4AF"],
    status: { done: "#A7F3D0", partial: "#FDE68A", missed: "#FDA4AF", rest: "#8BD3FF", empty: "#F2D9F4" },
    visual: { strokeWidth: 15, cornerRadius: 20, grid: "soft", donutVariant: "soft", barVariant: "rounded" },
  }),
  radius: { card: "32px", button: "999px", pill: "999px" },
  effects: { backgroundStyle: "kawaii", pixel: false },
});
