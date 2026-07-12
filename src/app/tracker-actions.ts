import { UserSettings } from "../types";

export type SetSettings = (patch: Partial<UserSettings>) => void;
export type CycleStatus = (habitId: string, date: string) => void;
