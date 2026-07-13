import { describe, expect, it } from "vitest";
import { selectMascotMood, MascotMoodInput } from "./mascot-mood";

const base: MascotMoodInput = {
  enabled: true,
  todayScore: 20,
  monthScore: 40,
  fragileHabitCount: 0,
  currentHour: 12,
};

describe("selectMascotMood", () => {
  it("respecte les règles et leur priorité", () => {
    expect(selectMascotMood({ ...base, enabled: false, todayScore: 100 })).toBe("hidden");
    expect(selectMascotMood({ ...base, todayScore: 100 })).toBe("celebrate");
    expect(selectMascotMood({ ...base, monthScore: 90 })).toBe("celebrate");
    expect(selectMascotMood({ ...base, todayScore: 70, fragileHabitCount: 4 })).toBe("happy");
    expect(selectMascotMood({ ...base, fragileHabitCount: 4, currentHour: 23 })).toBe("worried");
    expect(selectMascotMood({ ...base, currentHour: 23 })).toBe("sleepy");
    expect(selectMascotMood(base)).toBe("idle");
  });
});
