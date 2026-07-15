import type { Dispatch, SetStateAction } from "react";
import { CycleStatus, SetSettings } from "../app/tracker-actions";
import { DashboardStats } from "../lib/dashboard-selectors";
import { AppData } from "../persistence";
import { AppTheme } from "../themes/theme-types";

export type DashboardPageProps = {
  data: AppData;
  theme: AppTheme;
  stats: DashboardStats;
  setSettings: SetSettings;
};

export type TodayPageProps = {
  data: AppData;
  setSettings: SetSettings;
  cycle: CycleStatus;
};

export type MonthPageProps = {
  data: AppData;
  theme: AppTheme;
  setSettings: SetSettings;
  cycle: CycleStatus;
};

export type HabitsPageProps = {
  data: AppData;
  setData: Dispatch<SetStateAction<AppData>>;
  setSettings: SetSettings;
};

export type StatsPageProps = {
  data: AppData;
  theme: AppTheme;
  stats: DashboardStats;
  setSettings: SetSettings;
};

export type SettingsPageProps = {
  data: AppData;
  setData: Dispatch<SetStateAction<AppData>>;
  setSettings: SetSettings;
};
