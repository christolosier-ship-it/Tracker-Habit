import type {
  AddHabit,
  CycleStatus,
  DeleteHabit,
  ReplaceData,
  SetSettings,
  UpdateHabit,
} from "../app/tracker-actions";
import type { TrackerAnalytics } from "../analytics/tracker-analytics";
import type { AppData } from "../persistence";
import type { AppTheme } from "../themes/theme-types";

export type DashboardPageProps = {
  data: AppData;
  theme: AppTheme;
  setSettings: SetSettings;
  analytics: TrackerAnalytics;
};

export type TodayPageProps = {
  data: AppData;
  analytics: TrackerAnalytics;
  today: string;
  cycle: CycleStatus;
};

export type MonthPageProps = Omit<TodayPageProps, "today"> & {
  theme: AppTheme;
  setSettings: SetSettings;
};

export type HabitsPageProps = {
  data: AppData;
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
