import { describe, expect, it } from "vitest";
import { resolveCompletionReaction, type PendingCompletion } from "./tracker-events";

const completion: PendingCompletion = {
  id: 1,
  date: "2026-02-15",
};
const before = { perfectDay: false, currentStreak: 2, bestStreak: 3 };

describe("résolution des réactions", () => {
  it("priorise la journée parfaite, puis le record, puis l’accomplissement", () => {
    expect(
      resolveCompletionReaction(
        completion,
        before,
        { perfectDay: true, currentStreak: 4 },
        completion.date,
      ),
    ).toBe("perfect-day");
    expect(
      resolveCompletionReaction(
        completion,
        before,
        { perfectDay: false, currentStreak: 4 },
        completion.date,
      ),
    ).toBe("streak-record");
    expect(
      resolveCompletionReaction(
        completion,
        before,
        { perfectDay: false, currentStreak: 3 },
        completion.date,
      ),
    ).toBe("habit-done");
  });
});
