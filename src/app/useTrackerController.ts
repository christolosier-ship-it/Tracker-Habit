import { useCallback, useMemo, useRef, useState } from "react";
import { selectDashboardStats } from "../lib/dashboard-selectors";
import { loadData } from "../lib/storage";
import { useDebouncedSave } from "../hooks/useDebouncedSave";
import { resolveTheme } from "../themes/theme-registry";
import { UserSettings } from "../types";
import { MascotReactionEvent } from "../features/mascot/mascot.types";
import * as S from "../lib/stats";

export function useTrackerController() {
  const [data, setData] = useState(loadData);
  const [mascotReaction, setMascotReaction] = useState<MascotReactionEvent | null>(null);
  const reactionIdRef = useRef(0);

  useDebouncedSave(data);

  const theme = useMemo(
    () => resolveTheme(data.settings.themeId),
    [data.settings.themeId],
  );

  const stats = useMemo(() => selectDashboardStats(data), [data]);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setData((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  }, []);

  const emitMascotReaction = useCallback((type: MascotReactionEvent["type"]) => {
    reactionIdRef.current += 1;
    setMascotReaction({ id: reactionIdRef.current, type });
  }, []);

  const clearMascotReaction = useCallback((reactionId: number) => {
    setMascotReaction((current) =>
      current?.id === reactionId ? null : current,
    );
  }, []);

  const cycleHabitStatus = useCallback((habitId: string, date: string) => {
    setData((current) => {
      const status = S.logFor(current.logs, habitId, date);
      const nextStatus =
        S.statusCycle[
          (S.statusCycle.indexOf(status) + 1) % S.statusCycle.length
        ];
      if (nextStatus === status) return current;

      const previousScore = S.calculateDayScore(
        current.habits,
        current.logs,
        date,
        current.settings,
      );
      const logs = S.setLog(current.logs, habitId, date, nextStatus);
      const nextScore = S.calculateDayScore(
        current.habits,
        logs,
        date,
        current.settings,
      );

      if (nextScore === 100 && previousScore !== 100) {
        emitMascotReaction("perfect-day");
      } else if (nextStatus === "done") {
        emitMascotReaction("habit-done");
      }

      return {
        ...current,
        logs,
      };
    });
  }, [emitMascotReaction]);

  return {
    data,
    setData,
    theme,
    stats,
    updateSettings,
    cycleHabitStatus,
    mascotReaction,
    clearMascotReaction,
  };
}
