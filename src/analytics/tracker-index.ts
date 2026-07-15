import type { HabitLog, HabitStatus } from "../types";
import { getIsoWeekKey } from "../lib/date-utils";

export type TrackerIndex = {
  byKey: Map<string, HabitStatus>;
  byDate: Map<string, HabitLog[]>;
  byHabit: Map<string, HabitLog[]>;
  byHabitWeek: Map<string, HabitLog[]>;
};

function logKey(habitId: string, date: string) {
  return `${habitId}|${date}`;
}

function append(
  map: Map<string, HabitLog[]>,
  key: string,
  log: HabitLog,
) {
  const bucket = map.get(key);
  if (bucket) bucket.push(log);
  else map.set(key, [log]);
}

export function buildTrackerIndex(logs: HabitLog[]): TrackerIndex {
  const index: TrackerIndex = {
    byKey: new Map(),
    byDate: new Map(),
    byHabit: new Map(),
    byHabitWeek: new Map(),
  };

  for (const log of logs) {
    index.byKey.set(logKey(log.habitId, log.date), log.status);
    append(index.byDate, log.date, log);
    append(index.byHabit, log.habitId, log);
    append(index.byHabitWeek, `${log.habitId}|${getIsoWeekKey(log.date)}`, log);
  }

  return index;
}

export function readTrackerStatus(
  index: TrackerIndex,
  habitId: string,
  date: string,
) {
  return index.byKey.get(logKey(habitId, date)) ?? "empty";
}

export function readHabitWeekLogs(
  index: TrackerIndex,
  habitId: string,
  dateInWeek: string,
) {
  return index.byHabitWeek.get(`${habitId}|${getIsoWeekKey(dateInWeek)}`) ?? [];
}
