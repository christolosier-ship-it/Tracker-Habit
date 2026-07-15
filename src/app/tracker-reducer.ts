import { HABIT_STATUS_CYCLE } from "../domain/definitions";
import { habitExistsOnDate } from "../domain/evaluation";
import type { Habit } from "../domain/tracker-types";
import {
  compareIsoDates,
  isValidIsoDate,
  shiftIsoDate,
} from "../lib/date-utils";
import type { AppData } from "../persistence";
import type { UserSettings } from "../types";
import type { UpdateHabitPatch } from "./tracker-actions";
import type {
  PendingCompletion,
  TrackerReaction,
  TrackerReactionEvent,
} from "./tracker-events";

export type TrackerState = {
  data: AppData;
  mascotReaction: TrackerReactionEvent | null;
  pendingCompletion: PendingCompletion | null;
  nextEventId: number;
  nextReactionId: number;
};

export type TrackerAction =
  | { type: "settings/patch"; patch: Partial<UserSettings> }
  | { type: "habit/add"; habit: Habit }
  | {
      type: "habit/update";
      habitId: string;
      patch: UpdateHabitPatch;
      today: string;
    }
  | { type: "habit/delete"; habitId: string }
  | {
      type: "log/cycle";
      habitId: string;
      date: string;
      today: string;
      logIndex?: number;
      trackCompletion?: boolean;
    }
  | { type: "data/replace"; data: AppData }
  | {
      type: "reaction/resolve";
      completionId: number;
      reaction: TrackerReaction;
    }
  | { type: "reaction/clear"; reactionId: number };

export function createTrackerState(data: AppData): TrackerState {
  return {
    data,
    mascotReaction: null,
    pendingCompletion: null,
    nextEventId: 0,
    nextReactionId: 0,
  };
}

function patchSettings(settings: UserSettings, patch: Partial<UserSettings>) {
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

function cycleLog(
  state: TrackerState,
  action: Extract<TrackerAction, { type: "log/cycle" }>,
) {
  const { data } = state;
  const habit = data.habits.find((candidate) => candidate.id === action.habitId);
  if (
    !habit?.active ||
    !isValidIsoDate(action.date) ||
    compareIsoDates(action.date, action.today) > 0 ||
    !habitExistsOnDate(habit, action.date)
  ) {
    return state;
  }

  const hintedLog = action.logIndex === undefined
    ? undefined
    : data.logs[action.logIndex];
  const logIndex =
    hintedLog?.habitId === habit.id && hintedLog.date === action.date
      ? action.logIndex!
      : data.logs.findIndex(
          (log) => log.habitId === habit.id && log.date === action.date,
        );
  const currentStatus = logIndex >= 0 ? data.logs[logIndex].status : "empty";
  const nextStatus =
    HABIT_STATUS_CYCLE[
      (HABIT_STATUS_CYCLE.indexOf(currentStatus) + 1) %
        HABIT_STATUS_CYCLE.length
    ];
  const logs = [...data.logs];
  if (logIndex >= 0 && nextStatus === "empty") logs.splice(logIndex, 1);
  else if (logIndex >= 0) {
    logs[logIndex] = { habitId: habit.id, date: action.date, status: nextStatus };
  } else {
    logs.push({ habitId: habit.id, date: action.date, status: nextStatus });
  }

  if (nextStatus !== "done" || !action.trackCompletion) {
    return { ...state, data: { ...data, logs } };
  }
  const eventId = state.nextEventId + 1;
  return {
    ...state,
    data: { ...data, logs },
    nextEventId: eventId,
    pendingCompletion: {
      id: eventId,
      date: action.date,
    },
  };
}

export function trackerReducer(
  state: TrackerState,
  action: TrackerAction,
): TrackerState {
  switch (action.type) {
    case "settings/patch": {
      const settings = patchSettings(state.data.settings, action.patch);
      if (settings === state.data.settings) return state;
      const mascotDisabled = settings.mascotEnabled === false;
      return {
        ...state,
        data: { ...state.data, settings },
        mascotReaction: mascotDisabled ? null : state.mascotReaction,
        pendingCompletion: mascotDisabled ? null : state.pendingCompletion,
      };
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
      const current = state.data.habits[index];
      const patch = { ...action.patch };
      if (state.data.logs.some((log) => log.habitId === current.id)) {
        delete patch.categorie;
        delete patch.frequence;
        delete patch.priorite;
      }
      if (Object.entries(patch).every(
        ([key, value]) => current[key as keyof Habit] === value,
      )) return state;
      const updated: Habit = { ...current, ...patch };
      if (patch.active !== undefined && patch.active !== current.active) {
        if (patch.active) {
          if (
            current.archivedAt &&
            compareIsoDates(action.today, current.archivedAt) > 0
          ) {
            updated.inactiveRanges = [
              ...(current.inactiveRanges ?? []),
              {
                start: shiftIsoDate(current.archivedAt, 1),
                end: shiftIsoDate(action.today, -1),
              },
            ];
          }
          delete updated.archivedAt;
        } else updated.archivedAt = action.today;
      }
      const habits = [...state.data.habits];
      habits[index] = updated;
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
          habits: state.data.habits.filter((habit) => habit.id !== action.habitId),
          logs: state.data.logs.filter((log) => log.habitId !== action.habitId),
        },
      };
    }
    case "log/cycle":
      return cycleLog(state, action);
    case "data/replace":
      return {
        ...state,
        data: action.data,
        mascotReaction: null,
        pendingCompletion: null,
      };
    case "reaction/resolve": {
      if (state.pendingCompletion?.id !== action.completionId) return state;
      const reactionId = state.nextReactionId + 1;
      return {
        ...state,
        pendingCompletion: null,
        mascotReaction: { id: reactionId, type: action.reaction },
        nextReactionId: reactionId,
      };
    }
    case "reaction/clear":
      return state.mascotReaction?.id === action.reactionId
        ? { ...state, mascotReaction: null }
        : state;
  }
}
