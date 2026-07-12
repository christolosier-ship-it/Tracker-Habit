import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { AmbientBackground } from "../components/effects/premium-effects";
import { ThemeNavigationStatus } from "../components/theme-identity/ThemeNavigationStatus";
import { typographyClass } from "../components/theme-identity/identity-utils";
import { applyThemeStyle } from "../themes/apply-theme";
import { resolveTheme } from "../themes/theme-registry";
import { selectDashboardStats } from "../lib/dashboard-selectors";
import { loadData } from "../lib/storage";
import { useDebouncedSave } from "../hooks/useDebouncedSave";
import { pageSpecs, Page } from "./constants";
import {
  DashboardPage,
  HabitsPage,
  MonthPage,
  SettingsPage,
  StatsPage,
  TodayPage,
} from "./pages";
import * as S from "../lib/stats";

export function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState<Page>("Dashboard");
  const activeTheme = useMemo(
    () => resolveTheme(data.settings.themeId),
    [data.settings.themeId],
  );
  const stats = useMemo(() => selectDashboardStats(data), [data]);

  useDebouncedSave(data);

  const setSettings = (patch: Partial<typeof data.settings>) => {
    setData((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  };

  const cycle = (habitId: string, date: string) => {
    setData((current) => {
      const status = S.logFor(current.logs, habitId, date);
      const nextStatus =
        S.statusCycle[
          (S.statusCycle.indexOf(status) + 1) % S.statusCycle.length
        ];
      return {
        ...current,
        logs: S.setLog(current.logs, habitId, date, nextStatus),
      };
    });
  };

  const pageProps = {
    data,
    theme: activeTheme,
    stats,
    setData,
    setSettings,
    cycle,
  };

  return (
    <div
      className={`app-shell ${typographyClass(activeTheme)}`}
      data-theme={activeTheme.id}
      data-theme-style={activeTheme.effects.backgroundStyle}
      style={applyThemeStyle(activeTheme)}
    >
      <AmbientBackground />
      <nav
        className="sidebar"
        aria-label="Navigation principale"
        data-navigation-style={activeTheme.identity.navigation.variant}
      >
        <div className="brand">
          <Flame />
          <div>
            Discipline
            <span>Dashboard</span>
          </div>
        </div>
        <ThemeNavigationStatus theme={activeTheme} />
        {pageSpecs.map(({ name, icon: Icon }) => (
          <button
            className={page === name ? "active" : ""}
            onClick={() => setPage(name)}
            key={name}
            type="button"
          >
            <Icon />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <main>
        {page === "Dashboard" && <DashboardPage {...pageProps} />}
        {page === "Aujourd’hui" && <TodayPage {...pageProps} />}
        {page === "Mois" && <MonthPage {...pageProps} />}
        {page === "Habitudes" && <HabitsPage {...pageProps} />}
        {page === "Statistiques" && <StatsPage {...pageProps} />}
        {page === "Paramètres" && <SettingsPage {...pageProps} />}
      </main>
    </div>
  );
}
