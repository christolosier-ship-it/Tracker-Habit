import React from "react";
import { DashboardStats } from "../lib/dashboard-selectors";
import { AppData } from "../lib/storage";
import { AppTheme } from "../themes/theme-types";
import { UserSettings } from "../types";
import { CycleStatus } from "../features/tracking/HabitStatusCard";

export type SetSettings = (patch: Partial<UserSettings>) => void;

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
  setData: React.Dispatch<React.SetStateAction<AppData>>;
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
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  setSettings: SetSettings;
};
