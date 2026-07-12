import { HabitLog, HabitStatus } from "../types";

export type LogIndex = Map<string, HabitStatus>;

export function logKey(habitId: string, date: string) {
  return `${habitId}|${date}`;
}

export function buildLogIndex(logs: HabitLog[]): LogIndex {
  return new Map(logs.map((log) => [logKey(log.habitId, log.date), log.status]));
}

export function readIndexedLog(index: LogIndex, habitId: string, date: string) {
  return index.get(logKey(habitId, date)) ?? "empty";
}
