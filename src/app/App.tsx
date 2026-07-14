import { lazy, Suspense, useState } from "react";
import { Flame } from "lucide-react";
import { AmbientBackground } from "../components/effects/premium-effects";
import { ThemeNavigationStatus } from "../components/theme-identity/ThemeNavigationStatus";
import { typographyClass } from "../components/theme-identity/identity-utils";
import { RoamingMascot } from "../features/mascot/RoamingMascot";
import { selectMascotMood } from "../features/mascot/mascot-mood";
import { applyThemeStyle } from "../themes/apply-theme";
import { pageSpecs, Page } from "./constants";
import { useTrackerController } from "./useTrackerController";
import { useCurrentHour } from "./useCurrentHour";

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({ default: module.DashboardPage })),
);
const TodayPage = lazy(() =>
  import("../pages/TodayPage").then((module) => ({ default: module.TodayPage })),
);
const MonthPage = lazy(() =>
  import("../pages/MonthPage").then((module) => ({ default: module.MonthPage })),
);
const HabitsPage = lazy(() =>
  import("../pages/HabitsPage").then((module) => ({ default: module.HabitsPage })),
);
const StatsPage = lazy(() =>
  import("../pages/StatsPage").then((module) => ({ default: module.StatsPage })),
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((module) => ({ default: module.SettingsPage })),
);

export function App() {
  const [page, setPage] = useState<Page>("Dashboard");
  const currentHour = useCurrentHour();
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
    currentHour,
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
        <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
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
        </Suspense>
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
