import type { HabitLog, TrackerLogReader } from "../domain/tracker-types";
import type { HabitStatus } from "../domain/definitions";
import { getIsoWeekKey } from "../lib/date-utils";

export type TrackerIndex = TrackerLogReader & {
  byKey: Map<string, HabitStatus>;
  positionByKey: Map<string, number>;
  byDate: Map<string, HabitLog[]>;
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

export function buildTrackerIndex(
  logs: HabitLog[],
  weeklyHabitIds: ReadonlySet<string>,
): TrackerIndex {
  const index: TrackerIndex = {
    byKey: new Map(),
    positionByKey: new Map(),
    byDate: new Map(),
    byHabitWeek: new Map(),
    readStatus: (habitId, date) => index.byKey.get(logKey(habitId, date)) ?? "empty",
    readWeekLogs: (habitId, dateInWeek) =>
      index.byHabitWeek.get(`${habitId}|${getIsoWeekKey(dateInWeek)}`) ?? [],
  };

  for (const [position, log] of logs.entries()) {
    index.byKey.set(logKey(log.habitId, log.date), log.status);
    index.positionByKey.set(logKey(log.habitId, log.date), position);
    append(index.byDate, log.date, log);
    if (weeklyHabitIds.has(log.habitId)) {
      append(index.byHabitWeek, `${log.habitId}|${getIsoWeekKey(log.date)}`, log);
    }
  }

  return index;
}

export function readTrackerLogPosition(
  index: TrackerIndex,
  habitId: string,
  date: string,
) {
  return index.positionByKey.get(logKey(habitId, date));
}

export function readTrackerStatus(
  index: TrackerIndex,
  habitId: string,
  date: string,
) {
  return index.readStatus(habitId, date);
}
