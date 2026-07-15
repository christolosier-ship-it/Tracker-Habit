import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import { RoamingMascot } from "../features/mascot/RoamingMascot";
import { demoData } from "../persistence";
import { resolveTheme } from "../themes/theme-registry";
import { DashboardPage } from "./DashboardPage";
import { HabitsPage } from "./HabitsPage";
import { MonthPage } from "./MonthPage";
import { SettingsPage } from "./SettingsPage";
import { StatsPage } from "./StatsPage";
import { TodayPage } from "./TodayPage";

const data = demoData();
const theme = resolveTheme(data.settings.themeId);
const analytics = createTrackerAnalytics(data.habits, data.logs, data.settings);
const setSettings = () => undefined;
const cycle = () => undefined;
const addHabit = () => undefined;
const updateHabit = () => undefined;
const deleteHabit = () => undefined;
const replaceData = () => undefined;

const pages = [
  <DashboardPage
    data={data}
    theme={theme}
    analytics={analytics}
    setSettings={setSettings}
  />,
  <TodayPage
    data={data}
    analytics={analytics}
    today={analytics.today}
    cycle={cycle}
  />,
  <MonthPage
    data={data}
    theme={theme}
    analytics={analytics}
    setSettings={setSettings}
    cycle={cycle}
  />,
  <HabitsPage
    data={data}
    addHabit={addHabit}
    updateHabit={updateHabit}
    deleteHabit={deleteHabit}
  />,
  <StatsPage
    data={data}
    theme={theme}
    analytics={analytics}
    setSettings={setSettings}
  />,
  <SettingsPage
    data={data}
    replaceData={replaceData}
    setSettings={setSettings}
  />,
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

  it("rend les graphiques SVG natifs sans dépendance de rendu externe", () => {
    const html = renderToStaticMarkup(
      <DashboardPage
        data={data}
        theme={theme}
        analytics={analytics}
        setSettings={setSettings}
      />,
    );
    expect(html).toContain("native-cartesian-chart");
    expect(html).toContain("native-donut-chart");
    expect(html).not.toContain("recharts");
  });

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
