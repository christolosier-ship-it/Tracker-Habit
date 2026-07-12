import { useState } from "react";
import { Flame } from "lucide-react";
import { AmbientBackground } from "../components/effects/premium-effects";
import { ThemeNavigationStatus } from "../components/theme-identity/ThemeNavigationStatus";
import { typographyClass } from "../components/theme-identity/identity-utils";
import { applyThemeStyle } from "../themes/apply-theme";
import { pageSpecs, Page } from "./constants";
import {
  DashboardPage,
  HabitsPage,
  MonthPage,
  SettingsPage,
  StatsPage,
  TodayPage,
} from "./pages";
import { useTrackerController } from "./useTrackerController";

export function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const {
    data,
    setData,
    theme,
    stats,
    updateSettings,
    cycleHabitStatus,
  } = useTrackerController();

  const pageProps = {
    data,
    theme,
    stats,
    setData,
    setSettings: updateSettings,
    cycle: cycleHabitStatus,
  };

  return (
    <div
      className={`app-shell ${typographyClass(theme)}`}
      data-theme={theme.id}
      data-theme-style={theme.effects.backgroundStyle}
      style={applyThemeStyle(theme)}
    >
      <AmbientBackground />
      <nav
        className="sidebar"
        aria-label="Navigation principale"
        data-navigation-style={theme.identity.navigation.variant}
      >
        <div className="brand">
          <Flame />
          <div>
            Discipline
            <span>Dashboard</span>
          </div>
        </div>
        <ThemeNavigationStatus theme={theme} />
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
