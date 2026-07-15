import type {
  AddHabit,
  CycleStatus,
  DeleteHabit,
  ReplaceData,
  SetSettings,
  UpdateHabit,
} from "../app/tracker-actions";
import type { AppData } from "../persistence";
import type { AppTheme } from "../themes/theme-types";

export type DashboardPageProps = {
  data: AppData;
  theme: AppTheme;
  setSettings: SetSettings;
};

export type TodayPageProps = {
  data: AppData;
  setSettings: SetSettings;
  cycle: CycleStatus;
};

export type MonthPageProps = TodayPageProps & { theme: AppTheme };

export type HabitsPageProps = {
  data: AppData;
  setSettings: SetSettings;
  addHabit: AddHabit;
  updateHabit: UpdateHabit;
  deleteHabit: DeleteHabit;
};

export type StatsPageProps = DashboardPageProps;

export type SettingsPageProps = {
  data: AppData;
  setSettings: SetSettings;
  replaceData: ReplaceData;
};
