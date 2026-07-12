import { useCallback, useMemo, useState } from "react";
import { selectDashboardStats } from "../lib/dashboard-selectors";
import { loadData } from "../lib/storage";
import { useDebouncedSave } from "../hooks/useDebouncedSave";
import { resolveTheme } from "../themes/theme-registry";
import { UserSettings } from "../types";
import * as S from "../lib/stats";

export function useTrackerController() {
  const [data, setData] = useState(loadData);

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

  const cycleHabitStatus = useCallback((habitId: string, date: string) => {
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
  }, []);

  return {
    data,
    setData,
    theme,
    stats,
    updateSettings,
    cycleHabitStatus,
  };
}
