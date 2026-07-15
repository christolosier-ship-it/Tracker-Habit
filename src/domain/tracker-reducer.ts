import { createTrackerAnalytics } from "../analytics/tracker-analytics";
import { HABIT_STATUS_CYCLE } from "./definitions";
import { habitExistsOnDate } from "./evaluation";
import type { MascotReactionEvent } from "../features/mascot/mascot.types";
import { formatLocalIso, isValidIsoDate } from "../lib/date-utils";
import { migrateData, type AppData } from "../persistence";
import type { Habit, UserSettings } from "../types";
import {
  buildTrackerIndex,
  readTrackerStatus,
} from "../analytics/tracker-index";

export type TrackerState = {
  data: AppData;
  mascotReaction: MascotReactionEvent | null;
  nextReactionId: number;
};

export type TrackerAction =
  | { type: "settings/patch"; patch: Partial<UserSettings> }
  | { type: "habit/add"; habit: Habit }
  | {
      type: "habit/update";
      habitId: string;
      patch: Partial<Omit<Habit, "id">>;
    }
  | { type: "habit/delete"; habitId: string }
  | { type: "log/cycle"; habitId: string; date: string; now: Date }
  | { type: "data/replace"; data: AppData }
  | { type: "reaction/clear"; reactionId: number };

export function createTrackerState(data: AppData): TrackerState {
  return { data, mascotReaction: null, nextReactionId: 0 };
}

function emitReaction(
  state: TrackerState,
  type: MascotReactionEvent["type"],
): TrackerState {
  const id = state.nextReactionId + 1;
  return {
    ...state,
    mascotReaction: { id, type },
    nextReactionId: id,
  };
}

function patchSettings(
  settings: UserSettings,
  patch: Partial<UserSettings>,
) {
  const next = { ...settings, ...patch };
  if (
    !Number.isInteger(next.anneeActive) ||
    next.anneeActive < 1970 ||
    next.anneeActive > 2200 ||
    !Number.isInteger(next.moisActif) ||
    next.moisActif < 0 ||
    next.moisActif > 11
  ) {
    return settings;
  }
  return Object.entries(patch).every(
    ([key, value]) => settings[key as keyof UserSettings] === value,
  )
    ? settings
    : next;
}

function cycleLog(state: TrackerState, action: Extract<TrackerAction, { type: "log/cycle" }>) {
  const { data } = state;
  const habit = data.habits.find((candidate) => candidate.id === action.habitId);
  if (
    !habit?.active ||
    !isValidIsoDate(action.date) ||
    !habitExistsOnDate(habit, action.date)
  ) {
    return state;
  }

  const currentStatus = readTrackerStatus(
    buildTrackerIndex(data.logs),
    habit.id,
    action.date,
  );
  const nextStatus =
    HABIT_STATUS_CYCLE[
      (HABIT_STATUS_CYCLE.indexOf(currentStatus) + 1) %
        HABIT_STATUS_CYCLE.length
    ];
  const logIndex = data.logs.findIndex(
    (log) => log.habitId === habit.id && log.date === action.date,
  );
  const logs = [...data.logs];
  if (logIndex >= 0 && nextStatus === "empty") logs.splice(logIndex, 1);
  else if (logIndex >= 0) {
    logs[logIndex] = { habitId: habit.id, date: action.date, status: nextStatus };
  } else if (nextStatus !== "empty") {
    logs.push({ habitId: habit.id, date: action.date, status: nextStatus });
  }
  if (logs === data.logs) return state;

  const nextData = { ...data, logs };
  const nextState = { ...state, data: nextData };
  if (nextStatus !== "done") return nextState;

  const before = createTrackerAnalytics(
    data.habits,
    data.logs,
    data.settings,
    action.now,
  );
  const after = createTrackerAnalytics(
    nextData.habits,
    nextData.logs,
    nextData.settings,
    action.now,
  );
  if (
    after.isPerfectDay(action.date) &&
    !before.isPerfectDay(action.date)
  ) {
    return emitReaction(nextState, "perfect-day");
  }

  const year = Number(action.date.slice(0, 4));
  if (
    action.date === formatLocalIso(action.now) &&
    after.currentStreak() > before.bestStreak(year)
  ) {
    return emitReaction(nextState, "streak-record");
  }
  return emitReaction(nextState, "habit-done");
}

export function trackerReducer(
  state: TrackerState,
  action: TrackerAction,
): TrackerState {
  switch (action.type) {
    case "settings/patch": {
      const settings = patchSettings(state.data.settings, action.patch);
      return settings === state.data.settings
        ? state
        : { ...state, data: { ...state.data, settings } };
    }
    case "habit/add":
      return state.data.habits.some((habit) => habit.id === action.habit.id)
        ? state
        : {
            ...state,
            data: {
              ...state.data,
              habits: [...state.data.habits, action.habit],
            },
          };
    case "habit/update": {
      const index = state.data.habits.findIndex(
        (habit) => habit.id === action.habitId,
      );
      if (index < 0) return state;
      const habits = [...state.data.habits];
      habits[index] = { ...habits[index], ...action.patch };
      return { ...state, data: { ...state.data, habits } };
    }
    case "habit/delete": {
      if (!state.data.habits.some((habit) => habit.id === action.habitId)) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          habits: state.data.habits.filter(
            (habit) => habit.id !== action.habitId,
          ),
          logs: state.data.logs.filter(
            (log) => log.habitId !== action.habitId,
          ),
        },
      };
    }
    case "log/cycle":
      return cycleLog(state, action);
    case "data/replace":
      return { ...state, data: migrateData(action.data), mascotReaction: null };
    case "reaction/clear":
      return state.mascotReaction?.id === action.reactionId
        ? { ...state, mascotReaction: null }
        : state;
  }
}
