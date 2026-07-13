import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
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

describe("montage des pages", () => {
  it.each(pages.map((page, index) => [index, page]))(
    "rend la page %s sans exception",
    (_index, page) => {
      const html = renderToStaticMarkup(page);
      expect(html.length).toBeGreaterThan(100);
    },
  );


  it("rend le Dashboard avec les douze mascottes et sans SVG quand elles sont désactivées", () => {
    for (const candidateTheme of [
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
    ] as const) {
      const themedData = {
        ...data,
        settings: { ...data.settings, themeId: candidateTheme, mascotEnabled: true },
      };
      const html = renderToStaticMarkup(
        <DashboardPage
          data={themedData}
          theme={resolveTheme(candidateTheme)}
          stats={stats}
          setSettings={setSettings}
        />,
      );
      expect(html).toContain("Compagnon animé du Dashboard");
      expect(html).toContain('data-theme="' + candidateTheme + '"');
    }

    const disabledData = {
      ...data,
      settings: { ...data.settings, mascotEnabled: false },
    };
    const disabledHtml = renderToStaticMarkup(
      <DashboardPage
        data={disabledData}
        theme={theme}
        stats={stats}
        setSettings={setSettings}
      />,
    );
    expect(disabledHtml).not.toContain("Compagnon animé du Dashboard");
  });
});
