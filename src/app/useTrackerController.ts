import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import {
  readTrackerLogPosition,
  readTrackerStatus,
} from "../analytics/tracker-index";
import { HABIT_STATUS_CYCLE } from "../domain/definitions";
import type { Habit } from "../domain/tracker-types";
import { useDebouncedSave } from "../hooks/useDebouncedSave";
import {
  loadData,
  migrateData,
  type ImportableAppData,
} from "../persistence";
import { resolveTheme } from "../themes/theme-registry";
import type { UserSettings } from "../types";
import { resolveCompletionReaction } from "./tracker-events";
import { createTrackerState, trackerReducer } from "./tracker-reducer";
import type { UpdateHabitPatch } from "./tracker-actions";

const DISABLED_MASCOT_STATS = {
  todayScore: null,
  currentMonthScore: null,
  fragileHabitCount: 0,
} as const;

export function useTrackerController(today: string) {
  const [state, dispatch] = useReducer(
    trackerReducer,
    undefined,
    () => createTrackerState(loadData()),
  );
  const { data, mascotReaction, pendingCompletion } = state;
  const storageError = useDebouncedSave(data);

  const theme = useMemo(
    () => resolveTheme(data.settings.themeId),
    [data.settings.themeId],
  );
  const analytics = useMemo(
    () =>
      createTrackerAnalytics(
        data.habits,
        data.logs,
        {
          compterNonSaisisCommeManques:
            data.settings.compterNonSaisisCommeManques,
        },
        today,
      ),
    [
      data.habits,
      data.logs,
      data.settings.compterNonSaisisCommeManques,
      today,
    ],
  );
  const deferredAnalytics = useDeferredValue(analytics);
  const mascotStats = useMemo(
    () =>
      data.settings.mascotEnabled
        ? deferredAnalytics.mascot()
        : DISABLED_MASCOT_STATS,
    [deferredAnalytics, data.settings.mascotEnabled],
  );
  const previousAnalytics = useRef(analytics);

  useEffect(() => {
    if (!pendingCompletion || !data.settings.mascotEnabled) return;
    const before = previousAnalytics.current;
    const year = Number(pendingCompletion.date.slice(0, 4));
    const reaction = resolveCompletionReaction(
      pendingCompletion,
      {
        perfectDay: before.isPerfectDay(pendingCompletion.date),
        currentStreak: before.currentStreak(),
        bestStreak: before.bestStreak(year),
      },
      {
        perfectDay: analytics.isPerfectDay(pendingCompletion.date),
        currentStreak: analytics.currentStreak(),
      },
      today,
    );
    dispatch({
      type: "reaction/resolve",
      completionId: pendingCompletion.id,
      reaction,
    });
  }, [analytics, data.settings.mascotEnabled, pendingCompletion, today]);

  useEffect(() => {
    previousAnalytics.current = analytics;
  }, [analytics]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    dispatch({ type: "settings/patch", patch });
  }, []);
  const cycleHabitStatus = useCallback(
    (habitId: string, date: string) => {
      const current = readTrackerStatus(analytics.index, habitId, date);
      const next =
        HABIT_STATUS_CYCLE[
          (HABIT_STATUS_CYCLE.indexOf(current) + 1) % HABIT_STATUS_CYCLE.length
        ];
      dispatch({
        type: "log/cycle",
        habitId,
        date,
        today,
        logIndex: readTrackerLogPosition(analytics.index, habitId, date),
        trackCompletion: data.settings.mascotEnabled && next === "done",
      });
    },
    [analytics, data.settings.mascotEnabled, today],
  );
  const addHabit = useCallback((habit: Habit) => {
    dispatch({ type: "habit/add", habit });
  }, []);
  const updateHabit = useCallback(
    (habitId: string, patch: UpdateHabitPatch) => {
      dispatch({ type: "habit/update", habitId, patch, today });
    },
    [today],
  );
  const deleteHabit = useCallback((habitId: string) => {
    dispatch({ type: "habit/delete", habitId });
  }, []);
  const replaceData = useCallback((nextData: ImportableAppData) => {
    dispatch({ type: "data/replace", data: migrateData(nextData) });
  }, []);
  const clearMascotReaction = useCallback((reactionId: number) => {
    dispatch({ type: "reaction/clear", reactionId });
  }, []);

  return {
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
  };
}
