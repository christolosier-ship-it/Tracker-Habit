import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RoamingMascot } from "../features/mascot/RoamingMascot";
import { selectDashboardStats } from "../lib/dashboard-selectors";
import { demoData } from "../lib/storage";
import { resolveTheme } from "../themes/theme-registry";
import {
  DashboardPage,
  HabitsPage,
  MonthPage,
  SettingsPage,
  StatsPage,
  TodayPage,
} from "./index";

const data = demoData();
const theme = resolveTheme(data.settings.themeId);
const stats = selectDashboardStats(data);
const setData = () => undefined;
const setSettings = () => undefined;
const cycle = () => undefined;

const pages = [
  <DashboardPage
    data={data}
    theme={theme}
    stats={stats}
    setSettings={setSettings}
  />,
  <TodayPage data={data} setSettings={setSettings} cycle={cycle} />,
  <MonthPage
    data={data}
    theme={theme}
    setSettings={setSettings}
    cycle={cycle}
  />,
  <HabitsPage data={data} setData={setData} setSettings={setSettings} />,
  <StatsPage
    data={data}
    theme={theme}
    stats={stats}
    setSettings={setSettings}
  />,
  <SettingsPage data={data} setData={setData} setSettings={setSettings} />,
];

const themeIds = [
  "dopamine-pop",
  "neon-cyberpunk-matrix",
  "memphis-productivity",
  "aurora-glassmorphism",
  "tropical-festival",
  "retro-arcade",
  "cosmic-dreamscape",
  "kawaii-maximalist",
  "brutalist-color-clash",
  "editorial-fashion-tech",
  "comic-book-energy",
  "liquid-gradient-future",
] as const;

describe("montage des pages", () => {
  it.each(pages.map((page, index) => [index, page]))(
    "rend la page %s sans exception",
    (_index, page) => {
      const html = renderToStaticMarkup(page);
      expect(html.length).toBeGreaterThan(100);
    },
  );

  it("rend les douze mascottes lazy dans leur couche globale et masque la couche désactivée", () => {
    for (const candidateTheme of themeIds) {
      const html = renderToStaticMarkup(
        <RoamingMascot themeId={candidateTheme} mood="idle" />,
      );
      expect(html).toContain("roaming-mascot-layer");
      expect(html).toContain('class="app-mascot"');
      expect(html).toContain('data-theme="' + candidateTheme + '"');
    }

    const disabledHtml = renderToStaticMarkup(
      <RoamingMascot themeId={theme.id} mood="hidden" />,
    );
    expect(disabledHtml).toBe("");
  });
});
