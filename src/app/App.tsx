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
import { useCurrentTime } from "./useCurrentTime";

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
  const currentTime = useCurrentTime();
  const {
    data,
    theme,
    analytics,
    mascotStats,
    updateSettings,
    cycleHabitStatus,
    addHabit,
    updateHabit,
    deleteHabit,
    replaceData,
    mascotReaction,
    clearMascotReaction,
    storageError,
  } = useTrackerController(currentTime.date);

  const mascotMood = selectMascotMood({
    enabled: data.settings.mascotEnabled,
    todayScore: mascotStats.todayScore,
    monthScore: mascotStats.currentMonthScore,
    fragileHabitCount: mascotStats.fragileHabitCount,
    currentHour: currentTime.hour,
  });

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
        {storageError && (
          <p className="storage-warning" role="alert">
            La sauvegarde locale est saturée. Exporte tes données avant de continuer.
          </p>
        )}
        <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
        {page === "Dashboard" && (
          <DashboardPage
            data={data}
            theme={theme}
            analytics={analytics}
            setSettings={updateSettings}
          />
        )}
        {page === "Aujourd’hui" && (
          <TodayPage
            data={data}
            analytics={analytics}
            today={currentTime.date}
            cycle={cycleHabitStatus}
          />
        )}
        {page === "Mois" && (
          <MonthPage
            data={data}
            theme={theme}
            analytics={analytics}
            setSettings={updateSettings}
            cycle={cycleHabitStatus}
          />
        )}
        {page === "Habitudes" && (
          <HabitsPage
            data={data}
            addHabit={addHabit}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
          />
        )}
        {page === "Statistiques" && (
          <StatsPage
            data={data}
            theme={theme}
            analytics={analytics}
            setSettings={updateSettings}
          />
        )}
        {page === "Paramètres" && (
          <SettingsPage
            data={data}
            setSettings={updateSettings}
            replaceData={replaceData}
          />
        )}
        </Suspense>
      </main>

      {data.settings.mascotEnabled && (
        <RoamingMascot
          themeId={theme.id}
          mood={mascotMood}
          reaction={mascotReaction}
          onReactionComplete={clearMascotReaction}
        />
      )}
    </div>
  );
}
