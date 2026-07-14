import { useState } from "react";
import { Flame } from "lucide-react";
import { AmbientBackground } from "../components/effects/premium-effects";
import { ThemeNavigationStatus } from "../components/theme-identity/ThemeNavigationStatus";
import { typographyClass } from "../components/theme-identity/identity-utils";
import { RoamingMascot } from "../features/mascot/RoamingMascot";
import { selectMascotMood } from "../features/mascot/mascot-mood";
import { applyThemeStyle } from "../themes/apply-theme";
import { pageSpecs, Page } from "./constants";
import {
  DashboardPage,
  HabitsPage,
  MonthPage,
  SettingsPage,
  StatsPage,
  TodayPage,
} from "../pages";
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
    mascotReaction,
    clearMascotReaction,
  } = useTrackerController();

  const mascotMood = selectMascotMood({
    enabled: data.settings.mascotEnabled,
    todayScore: stats.todayScore,
    monthScore: stats.currentMonth,
    fragileHabitCount: stats.fragileHabits.length,
    currentHour: new Date().getHours(),
  });

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
        {page === "Dashboard" && (
          <DashboardPage
            data={data}
            theme={theme}
            stats={stats}
            setSettings={updateSettings}
          />
        )}
        {page === "Aujourd’hui" && <TodayPage {...pageProps} />}
        {page === "Mois" && <MonthPage {...pageProps} />}
        {page === "Habitudes" && <HabitsPage {...pageProps} />}
        {page === "Statistiques" && <StatsPage {...pageProps} />}
        {page === "Paramètres" && <SettingsPage {...pageProps} />}
      </main>

      <RoamingMascot
        themeId={theme.id}
        mood={mascotMood}
        reaction={mascotReaction}
        onReactionComplete={clearMascotReaction}
      />
    </div>
  );
}
