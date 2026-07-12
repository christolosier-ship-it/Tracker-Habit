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
});
