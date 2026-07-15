export type TrackerReaction = "habit-done" | "perfect-day" | "streak-record";

export type TrackerReactionEvent = {
  id: number;
  type: TrackerReaction;
};

export type CompletionSnapshot = {
  perfectDay: boolean;
  currentStreak: number;
  bestStreak: number;
};

export type PendingCompletion = {
  id: number;
  date: string;
};

export function resolveCompletionReaction(
  completion: PendingCompletion,
  before: CompletionSnapshot,
  after: { perfectDay: boolean; currentStreak: number },
  today: string,
): TrackerReaction {
  if (after.perfectDay && !before.perfectDay) return "perfect-day";
  if (
    completion.date === today &&
    after.currentStreak > before.currentStreak &&
    after.currentStreak > before.bestStreak
  ) {
    return "streak-record";
  }
  return "habit-done";
}
