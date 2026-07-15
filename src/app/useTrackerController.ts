import { useCallback, useMemo, useReducer } from "react";
import { selectMascotStats } from "../lib/dashboard-selectors";
import { loadData, type AppData } from "../persistence";
import { useDebouncedSave } from "../hooks/useDebouncedSave";
import { resolveTheme } from "../themes/theme-registry";
import type { Habit, UserSettings } from "../types";
import {
  createTrackerState,
  trackerReducer,
} from "../domain/tracker-reducer";

export function useTrackerController() {
  const [state, dispatch] = useReducer(
    trackerReducer,
    undefined,
    () => createTrackerState(loadData()),
  );
  const { data, mascotReaction } = state;
  useDebouncedSave(data);

  const theme = useMemo(
    () => resolveTheme(data.settings.themeId),
    [data.settings.themeId],
  );
  const mascotStats = useMemo(
    () =>
      selectMascotStats(
        data.habits,
        data.logs,
        data.settings.compterNonSaisisCommeManques,
      ),
    [
      data.habits,
      data.logs,
      data.settings.compterNonSaisisCommeManques,
    ],
  );

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    dispatch({ type: "settings/patch", patch });
  }, []);
  const cycleHabitStatus = useCallback((habitId: string, date: string) => {
    dispatch({ type: "log/cycle", habitId, date, now: new Date() });
  }, []);
  const addHabit = useCallback((habit: Habit) => {
    dispatch({ type: "habit/add", habit });
  }, []);
  const updateHabit = useCallback(
    (habitId: string, patch: Partial<Omit<Habit, "id">>) => {
      dispatch({ type: "habit/update", habitId, patch });
    },
    [],
  );
  const deleteHabit = useCallback((habitId: string) => {
    dispatch({ type: "habit/delete", habitId });
  }, []);
  const replaceData = useCallback((nextData: AppData) => {
    dispatch({ type: "data/replace", data: nextData });
  }, []);
  const clearMascotReaction = useCallback((reactionId: number) => {
    dispatch({ type: "reaction/clear", reactionId });
  }, []);

  return {
    data,
    theme,
    mascotStats,
    updateSettings,
    cycleHabitStatus,
    addHabit,
    updateHabit,
    deleteHabit,
    replaceData,
    mascotReaction,
    clearMascotReaction,
  };
}
